import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Calendar, MapPin, Camera, Download, Upload, Database } from 'lucide-react';
import { Toast } from './Toast';
import { storage } from '../utils/storage';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+\d{2}-\d{10}$/, 'Phone number must be in format: +XX-XXXXXXXXXX'),
  dateOfBirth: z.string(),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  bio: z.string().max(200, 'Bio must be less than 200 characters'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const STORAGE_KEY = 'user_profile';

export const UserProfile: React.FC = () => {
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [avatarUrl, setAvatarUrl] = React.useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: React.useMemo(() => {
      const savedProfile = localStorage.getItem(STORAGE_KEY);
      return savedProfile ? JSON.parse(savedProfile) : {
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        bio: '',
      };
    }, [])
  });

  const onSubmit = (data: ProfileFormData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setToast({
        message: 'Profile updated successfully',
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Failed to update profile',
        type: 'error'
      });
    }
  };

  const handleBackup = () => {
    try {
      const backupData = storage.createBackup();
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `booking-system-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setToast({
        message: 'Backup created successfully',
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Failed to create backup',
        type: 'error'
      });
    }
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = e.target?.result as string;
        storage.restoreBackup(backupData);
        setToast({
          message: 'Backup restored successfully',
          type: 'success'
        });
        // Reload the page to reflect restored data
        window.location.reload();
      } catch (error) {
        setToast({
          message: 'Failed to restore backup',
          type: 'error'
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                <button
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  onClick={() => {/* Implement avatar change logic */}}
                >
                  <Camera size={16} className="text-gray-600" />
                </button>
              </div>
              <h1 className="text-2xl font-bold text-white">My Profile</h1>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-8 bg-blue-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Database size={20} />
                Data Management
              </h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleBackup}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Download size={16} />
                  Backup Data
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                  <Upload size={16} />
                  Restore Data
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleRestore}
                    accept=".json"
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Existing form fields... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      Full Name
                    </div>
                  </label>
                  <input
                    {...register('fullName')}
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      Email
                    </div>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      Phone Number
                    </div>
                  </label>
                  <input
                    {...register('phone')}
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+XX-XXXXXXXXXX"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Date of Birth
                    </div>
                  </label>
                  <input
                    {...register('dateOfBirth')}
                    type="date"
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      Address
                    </div>
                  </label>
                  <input
                    {...register('address')}
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Main St, City, Country"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    {...register('bio')}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => reset()}
                  disabled={!isDirty}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={!isDirty}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

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