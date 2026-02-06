import React from 'react';
import { AlertCircle, CheckCircle, Database, Key, Server } from 'lucide-react';

interface QuickStartGuideProps {
  onClose: () => void;
}

export const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-yellow-500/20 p-3 rounded-lg">
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Setup Required</h2>
            <p className="text-slate-400">Configure Firebase to get started</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500/20 p-2 rounded-lg mt-1">
                <Server className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Step 1: Create Firebase Project</h3>
                <ol className="space-y-2 text-slate-300 text-sm list-decimal list-inside">
                  <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">Firebase Console</a></li>
                  <li>Click "Add project" and name it "Flex Point Gym"</li>
                  <li>Disable Google Analytics (optional)</li>
                  <li>Click "Create project"</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="bg-green-500/20 p-2 rounded-lg mt-1">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Step 2: Enable Services</h3>
                <div className="space-y-3 text-slate-300 text-sm">
                  <div>
                    <p className="font-semibold text-white mb-1">Authentication:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Go to Build → Authentication</li>
                      <li>Enable Email/Password sign-in method</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Firestore Database:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Go to Build → Firestore Database</li>
                      <li>Create database in Test mode</li>
                      <li>Choose your region</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-500/20 p-2 rounded-lg mt-1">
                <Key className="w-6 h-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Step 3: Get Configuration</h3>
                <ol className="space-y-2 text-slate-300 text-sm list-decimal list-inside">
                  <li>Go to Project Settings (gear icon)</li>
                  <li>Scroll to "Your apps" section</li>
                  <li>Click the Web icon {"</>"}</li>
                  <li>Copy the firebaseConfig object</li>
                  <li>Update <code className="bg-slate-900 px-2 py-1 rounded text-yellow-500">/src/config/firebase.ts</code></li>
                </ol>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-500/20 p-2 rounded-lg mt-1">
                <Database className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Step 4: Create Admin Account</h3>
                <ol className="space-y-2 text-slate-300 text-sm list-decimal list-inside">
                  <li>Click "Create Account" on the login page</li>
                  <li>Select "Admin" as role</li>
                  <li>Enter secret key: <code className="bg-slate-900 px-2 py-1 rounded text-yellow-500">FLEXPOINT_ADMIN_2024</code></li>
                  <li>Complete registration</li>
                  <li>Use "Create Demo Data" button to populate sample data</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-400 text-sm font-semibold mb-1">Security Note</p>
                <p className="text-slate-300 text-sm">
                  This is a demonstration system. Do not store sensitive personal or financial data without implementing proper security measures.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <a
            href="https://firebase.google.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
          >
            View Firebase Documentation →
          </a>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold rounded-lg transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
