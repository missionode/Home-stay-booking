import React from 'react';
import { format, parseISO } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, Search, Trash2, Users, Edit2 } from 'lucide-react';
import { storage } from '../utils/storage';
import type { Booking, Guest } from '../types/booking';
import { Toast } from './Toast';
import { BookingForm } from './BookingForm';

const columnHelper = createColumnHelper<Booking>();

const columns: ColumnDef<Booking, any>[] = [
  columnHelper.accessor('date', {
    header: 'Booking Date',
    cell: info => format(parseISO(info.getValue()), 'yyyy-MM-dd'),
  }),
  columnHelper.accessor('primaryBooker.fullName', {
    header: 'Name',
  }),
  columnHelper.accessor('primaryBooker.phoneNumber', {
    header: 'Phone Number',
  }),
  columnHelper.accessor('primaryBooker.age', {
    header: 'Age',
  }),
  columnHelper.accessor('primaryBooker.gender', {
    header: 'Gender',
    cell: info => info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1),
  }),
  columnHelper.accessor('additionalGuests', {
    header: 'Extra People',
    cell: info => {
      const guests = info.getValue();
      return guests.length > 0 ? (
        <div className="relative group">
          <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
            <Users size={16} />
            {guests.length}
          </button>
          <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-lg p-4 hidden group-hover:block z-10 min-w-[200px]">
            {guests.map((guest: Guest, index: number) => (
              <div key={index} className="mb-2 last:mb-0">
                <div className="font-medium">{guest.fullName}</div>
                <div className="text-sm text-gray-500">
                  {guest.phoneNumber} • {guest.age} years • {guest.gender}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        '0'
      );
    },
  }),
  columnHelper.accessor('id', {
    header: 'Actions',
    cell: info => (
      <div className="flex gap-2">
        <button
          onClick={() => info.table.options.meta?.editBooking(info.row.original)}
          className="text-blue-500 hover:text-blue-600 p-1 rounded transition-colors"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => info.table.options.meta?.deleteBooking(info.getValue())}
          className="text-red-500 hover:text-red-600 p-1 rounded transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  }),
];

export const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [dateRange, setDateRange] = React.useState<[Date | null, Date | null]>([null, null]);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState<string | null>(null);
  const [editingBooking, setEditingBooking] = React.useState<Booking | null>(null);

  // Load bookings from storage
  React.useEffect(() => {
    const allBookings = storage.getBookings();
    const bookingsList = Object.values(allBookings)
      .flat()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setBookings(bookingsList);
  }, []);

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
  };

  const handleEditSubmit = async (data: {
    primaryBooker: Guest;
    additionalGuests: Guest[];
  }) => {
    try {
      if (!editingBooking) return;

      // Check if phone number is unique (excluding the current booking)
      const isUnique = storage.isPhoneNumberUnique(
        editingBooking.date,
        data.primaryBooker.phoneNumber,
        editingBooking.id
      );

      if (!isUnique) {
        throw new Error('Phone number already exists for this date');
      }

      // Update the booking
      const updatedBooking: Booking = {
        ...editingBooking,
        primaryBooker: data.primaryBooker,
        additionalGuests: data.additionalGuests,
      };

      storage.updateBooking(updatedBooking);

      // Update the bookings list
      setBookings(prev =>
        prev.map(booking =>
          booking.id === editingBooking.id ? updatedBooking : booking
        )
      );

      setToast({
        message: 'Booking updated successfully',
        type: 'success'
      });
      setEditingBooking(null);
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Failed to update booking',
        type: 'error'
      });
    }
  };

  const handleDeleteBooking = (id: string) => {
    setShowConfirmDialog(id);
  };

  const confirmDelete = (confirmed: boolean) => {
    if (confirmed && showConfirmDialog) {
      try {
        const updatedBookings = { ...storage.getBookings() };
        
        // Find and remove the booking
        Object.keys(updatedBookings).forEach(date => {
          updatedBookings[date] = updatedBookings[date].filter(
            booking => booking.id !== showConfirmDialog
          );
          
          // Remove the date key if no bookings remain
          if (updatedBookings[date].length === 0) {
            delete updatedBookings[date];
          }
        });

        // Update localStorage
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        
        // Update state
        setBookings(prev => prev.filter(booking => booking.id !== showConfirmDialog));
        
        setToast({
          message: 'Booking cancelled successfully',
          type: 'success'
        });
      } catch (error) {
        setToast({
          message: 'Failed to cancel booking',
          type: 'error'
        });
      }
    }
    setShowConfirmDialog(null);
  };

  const table = useReactTable({
    data: bookings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    meta: {
      deleteBooking: handleDeleteBooking,
      editBooking: handleEditBooking,
    },
  });

  // Filter bookings based on date range
  React.useEffect(() => {
    const [startDate, endDate] = dateRange;
    if (startDate && endDate) {
      const filteredBookings = Object.values(storage.getBookings())
        .flat()
        .filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate >= startDate && bookingDate <= endDate;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setBookings(filteredBookings);
    }
  }, [dateRange]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Management</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={globalFilter}
                  onChange={e => setGlobalFilter(e.target.value)}
                  placeholder="Search bookings..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <DatePicker
                selectsRange
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
                placeholderText="Select date range"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 text-lg">No bookings found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th
                            key={header.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map(row => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                          <td
                            key={cell.id}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Cancellation</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => confirmDelete(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                No, Keep It
              </button>
              <button
                onClick={() => confirmDelete(true)}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg"
              >
                Yes, Cancel It
              </button>
            </div>
          </div>
        </div>
      )}

      {editingBooking && (
        <BookingForm
          onSubmit={handleEditSubmit}
          onClose={() => setEditingBooking(null)}
          initialData={{
            primaryBooker: editingBooking.primaryBooker,
            additionalGuests: editingBooking.additionalGuests,
          }}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};