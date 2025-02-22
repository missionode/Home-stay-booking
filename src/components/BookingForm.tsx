import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Loader2 } from 'lucide-react';
import { bookingFormSchema } from '../utils/validation';
import type { Guest } from '../types/booking';

interface BookingFormProps {
  onSubmit: (data: { primaryBooker: Guest; additionalGuests: Guest[] }) => Promise<void>;
  onClose: () => void;
  initialData?: {
    primaryBooker: Guest;
    additionalGuests: Guest[];
  };
}

export const BookingForm: React.FC<BookingFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: initialData || {
      primaryBooker: {
        fullName: '',
        phoneNumber: '',
        age: undefined,
        gender: 'male'
      },
      additionalGuests: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalGuests'
  });

  const onSubmitForm = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {initialData ? 'Edit Booking' : 'New Booking'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Primary Booker</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    {...register('primaryBooker.fullName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.primaryBooker?.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.primaryBooker.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    {...register('primaryBooker.phoneNumber')}
                    placeholder="+XX-XXXXXXXXXX"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.primaryBooker?.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.primaryBooker.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    {...register('primaryBooker.age', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.primaryBooker?.age && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.primaryBooker.age.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    {...register('primaryBooker.gender')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.primaryBooker?.gender && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.primaryBooker.gender.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Additional Guests</h3>
                {fields.length < 4 && (
                  <button
                    type="button"
                    onClick={() => append({
                      fullName: '',
                      phoneNumber: '',
                      age: undefined,
                      gender: 'male'
                    })}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <Plus size={16} />
                    Add Guest
                  </button>
                )}
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Guest {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        {...register(`additionalGuests.${index}.fullName`)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.additionalGuests?.[index]?.fullName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.additionalGuests[index]?.fullName?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        {...register(`additionalGuests.${index}.phoneNumber`)}
                        placeholder="+XX-XXXXXXXXXX"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.additionalGuests?.[index]?.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.additionalGuests[index]?.phoneNumber?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Age
                      </label>
                      <input
                        type="number"
                        {...register(`additionalGuests.${index}.age`, { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.additionalGuests?.[index]?.age && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.additionalGuests[index]?.age?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        {...register(`additionalGuests.${index}.gender`)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.additionalGuests?.[index]?.gender && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.additionalGuests[index]?.gender?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {initialData ? 'Update Booking' : 'Submit Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};