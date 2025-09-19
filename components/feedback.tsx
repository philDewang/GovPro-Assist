import React, { useState, FormEvent } from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';

type FeedbackType = 'bug' | 'feature';
type SubmissionStatus = 'idle' | 'submitting' | 'submitted';

export const Feedback: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState<FeedbackType>('bug');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<SubmissionStatus>('idle');
    const [error, setError] = useState('');

    const resetForm = () => {
        setFeedbackType('bug');
        setTitle('');
        setDescription('');
        setEmail('');
        setStatus('idle');
        setError('');
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        // Delay resetting the form until the modal has animated out
        setTimeout(resetForm, 300);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            setError('Title and Description are required.');
            return;
        }
        setError('');
        setStatus('submitting');
        
        // Mock API call to a backend that would then create a GitHub issue
        setTimeout(() => {
            console.log('Feedback submitted:', { feedbackType, title, description, email });
            setStatus('submitted');
        }, 1500);
    };

    const renderForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Feedback Type</label>
                <div className="mt-1 grid grid-cols-2 gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
                    <button type="button" onClick={() => setFeedbackType('bug')} className={`px-3 py-1 text-sm font-medium rounded-md ${feedbackType === 'bug' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Bug Report</button>
                    <button type="button" onClick={() => setFeedbackType('feature')} className={`px-3 py-1 text-sm font-medium rounded-md ${feedbackType === 'feature' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Feature Request</button>
                </div>
            </div>
            <div>
                <label htmlFor="feedback-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                    id="feedback-title"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={feedbackType === 'bug' ? "e.g., Diagram generator fails on..." : "e.g., Add support for Jira integration"}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3"
                />
            </div>
            <div>
                <label htmlFor="feedback-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                </label>
                <textarea
                    id="feedback-description"
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder={feedbackType === 'bug' ? "Please provide steps to reproduce the issue..." : "Please describe the feature and its value..."}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3"
                />
            </div>
            <div>
                <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Email (Optional)</label>
                <input
                    id="feedback-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="So we can contact you with updates"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3"
                />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            
            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex justify-center items-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {status === 'submitting' ? (
                   <Icon name="loading" className="animate-spin w-5 h-5 mr-3" />
                ) : (
                   <Icon name="send" className="w-5 h-5 mr-3" />
                )}
                <span>{status === 'submitting' ? 'Submitting...' : 'Submit Feedback'}</span>
            </button>
        </form>
    );

    const renderSuccess = () => (
        <div className="text-center py-8">
            <Icon name="check" className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Thank you!</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Your feedback has been submitted. We'll use it to improve GovPro Assistant.</p>
            <button
                onClick={resetForm}
                className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
                Submit Another Report
            </button>
        </div>
    );

    return (
        <>
            <button
                onClick={() => setModalOpen(true)}
                title="Submit Feedback"
                aria-label="Submit Feedback"
                className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <Icon name="flag" className="w-7 h-7" />
            </button>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Report a Bug or Request a Feature">
                {status === 'submitted' ? renderSuccess() : renderForm()}
            </Modal>
        </>
    );
};
