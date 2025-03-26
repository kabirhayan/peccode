import  { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Lock, UserCircle, Eye, EyeOff, Save, Upload, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfilePicture from '../components/ProfilePicture';

const SettingsPage = () => {
  const { user, isAuthenticated, isLoading, updateProfilePicture } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    bio: '',
  });
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newChallengeAlerts: true,
    submissionResults: true,
    weeklyDigest: false,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    // This would typically make an API call to update the user profile
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    // This would typically make an API call to update the password
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setSecurityForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleNotificationSave = (e: React.FormEvent) => {
    e.preventDefault();
    // This would typically make an API call to update notification preferences
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  const handleProfilePicChange = (file: File) => {
    // In a real app, you would upload the file to a server and get back a URL
    // For this demo, we'll use a local FileReader to create a data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        updateProfilePicture(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              {/* Sidebar */}
              <div className="md:w-64 bg-gray-50 md:border-r border-gray-200">
                <nav className="p-4 md:p-6 space-y-1">
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition ${
                      activeTab === 'profile'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <UserCircle size={20} />
                    <span className="font-medium">Profile</span>
                  </button>
                  
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition ${
                      activeTab === 'security'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('security')}
                  >
                    <Lock size={20} />
                    <span className="font-medium">Security</span>
                  </button>
                  
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition ${
                      activeTab === 'notifications'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('notifications')}
                  >
                    <Bell size={20} />
                    <span className="font-medium">Notifications</span>
                  </button>
                </nav>
              </div>
              
              {/* Content area */}
              <div className="flex-1 p-6">
                {saveSuccess && (
                  <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
                    <CheckCircle size={16} className="mr-2" />
                    Settings updated successfully!
                  </div>
                )}
                
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Settings</h2>
                    <p className="text-gray-600 mb-6">
                      Update your personal information and preferences.
                    </p>
                    
                    <div className="mb-6 flex flex-col items-center">
                      <ProfilePicture 
                        src={user?.profilePic || undefined}
                        alt={user?.name || 'User'}
                        size="xl"
                        editable={true}
                        onImageChange={handleProfilePicChange}
                        className="mb-3"
                      />
                      <p className="text-sm text-gray-500">Click on the image to change your profile picture</p>
                    </div>
                    
                    <form onSubmit={handleProfileSave}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            className="input"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            className="input bg-gray-50"
                            value={profileForm.email}
                            disabled
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Email cannot be changed. Contact administrator for assistance.
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                          </label>
                          <input
                            type="text"
                            className="input"
                            value={profileForm.department}
                            onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                          />
                        </div>
                        
                        {user?.role === 'student' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Roll Number
                            </label>
                            <input
                              type="text"
                              className="input bg-gray-50"
                              value={user.rollNumber}
                              disabled
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          className="input min-h-[100px]"
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                          placeholder="Tell us about yourself"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button type="submit" className="btn-primary flex items-center">
                          <Save size={16} className="mr-2" />
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h2>
                    <p className="text-gray-600 mb-6">
                      Manage your password and account security.
                    </p>
                    
                    <form onSubmit={handleSecuritySave}>
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              className="input pr-10"
                              value={securityForm.currentPassword}
                              onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              className="input pr-10"
                              value={securityForm.newPassword}
                              onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Password must be at least 8 characters and include a mix of letters, numbers, and symbols.
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className="input pr-10"
                              value={securityForm.confirmPassword}
                              onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button 
                          type="submit" 
                          className="btn-primary flex items-center"
                          disabled={
                            !securityForm.currentPassword || 
                            !securityForm.newPassword || 
                            securityForm.newPassword !== securityForm.confirmPassword
                          }
                        >
                          <Save size={16} className="mr-2" />
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Settings</h2>
                    <p className="text-gray-600 mb-6">
                      Manage how and when you receive notifications.
                    </p>
                    
                    <form onSubmit={handleNotificationSave}>
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between py-3 border-b">
                          <div>
                            <h3 className="text-gray-800 font-medium">Email Notifications</h3>
                            <p className="text-gray-500 text-sm">Receive notifications via email</p>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="toggleEmail" 
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              checked={notificationSettings.emailNotifications} 
                              onChange={() => setNotificationSettings({
                                ...notificationSettings,
                                emailNotifications: !notificationSettings.emailNotifications
                              })}
                            />
                            <label 
                              htmlFor="toggleEmail" 
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b">
                          <div>
                            <h3 className="text-gray-800 font-medium">New Challenge Alerts</h3>
                            <p className="text-gray-500 text-sm">Get notified when new coding challenges are posted</p>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="toggleChallenges" 
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              checked={notificationSettings.newChallengeAlerts} 
                              onChange={() => setNotificationSettings({
                                ...notificationSettings,
                                newChallengeAlerts: !notificationSettings.newChallengeAlerts
                              })}
                            />
                            <label 
                              htmlFor="toggleChallenges" 
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b">
                          <div>
                            <h3 className="text-gray-800 font-medium">Submission Results</h3>
                            <p className="text-gray-500 text-sm">Get notified about your submission results</p>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="toggleSubmissions" 
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              checked={notificationSettings.submissionResults} 
                              onChange={() => setNotificationSettings({
                                ...notificationSettings,
                                submissionResults: !notificationSettings.submissionResults
                              })}
                            />
                            <label 
                              htmlFor="toggleSubmissions" 
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b">
                          <div>
                            <h3 className="text-gray-800 font-medium">Weekly Digest</h3>
                            <p className="text-gray-500 text-sm">Receive a weekly summary of your activity</p>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="toggleDigest" 
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              checked={notificationSettings.weeklyDigest} 
                              onChange={() => setNotificationSettings({
                                ...notificationSettings,
                                weeklyDigest: !notificationSettings.weeklyDigest
                              })}
                            />
                            <label 
                              htmlFor="toggleDigest" 
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button type="submit" className="btn-primary flex items-center">
                          <Save size={16} className="mr-2" />
                          Save Preferences
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// For the toggle switch styling
const CheckCircle = ({ size, className }: { size: number; className: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default SettingsPage;
 