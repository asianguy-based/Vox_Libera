
import React from 'react';
import { CloseIcon } from './icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps): React.ReactElement | null => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">About Speech Assistant</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors p-1" aria-label="Close">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-6 text-slate-700">
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Purpose</h3>
            <p className="leading-relaxed">
              Speech Assistant (AAC) is an Augmentative and Alternative Communication application designed to give a voice to individuals who have difficulty speaking. Whether due to aphasia, autism, stroke, vocal cord damage, or other conditions, this app helps users communicate their needs, thoughts, and feelings effectively.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Key Features</h3>
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li><span className="font-medium">Visual Communication:</span> Uses intuitive icons and categories to build sentences quickly without typing.</li>
              <li><span className="font-medium">Text-to-Speech:</span> Instantly converts selected words or typed text into natural-sounding speech using advanced AI.</li>
              <li><span className="font-medium">Customization:</span> Personalized settings for voice selection, user profile, and text input.</li>
              <li><span className="font-medium">Accessibility Tools:</span> Includes a Full Screen mode for visual clarity and an Attention sound to alert others.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Resources</h3>
            <p className="mb-2 text-sm">Useful links for AAC support and information:</p>
            <ul className="list-none space-y-2 text-sm">
              <li>
                <a href="https://www.asha.org/public/speech/disorders/aac/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">
                  <span>•</span> ASHA - AAC Information
                </a>
              </li>
              <li>
                 <a href="https://isaac-online.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">
                  <span>•</span> ISAAC (International Society for AAC)
                </a>
              </li>
              <li>
                 <a href="https://www.autismspeaks.org/technology-and-autism" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">
                  <span>•</span> Autism Speaks - Technology
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
            <a 
              href='https://ko-fi.com/D1D61NBN42' 
              target='_blank' 
              rel="noopener noreferrer" 
              className='flex items-center gap-2 px-4 py-2 rounded-full font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-sm text-sm'
              style={{ backgroundColor: '#73a9f5' }}
            >
                <span role="img" aria-label="coffee" className="text-lg">☕</span>
                <span>Support me on Ko-fi</span>
            </a>

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md transition-colors"
            >
              Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
