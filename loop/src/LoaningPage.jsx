import React, { useState } from 'react';
import { MapPin, Home, Bell, User, Plus, Search, Star, Clock, Check, X, CheckCircle, XCircle, MessageCircle, Edit, Trash2 } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#1f2937'
        }}>{title}</h2>
        {children}
      </div>
    </div>
  );
};

const LoaningPage = () => {
  const [loaningFilter, setLoaningFilter] = useState('active');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [currentMessage, setCurrentMessage] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingLoaning, setReportingLoaning] = useState(null);
  const [reportData, setReportData] = useState({
    issue: '',
    description: '',
    photosWanted: false
  });

  const [loanings, setLoanings] = useState([
    {
      id: 1,
      item: 'USB-C to USB-C Charger',
      borrower: 'Sarah M.',
      borrowerId: 'user_2',
      pickupLocation: 'Thompson Hall',
      time: '2-4 pm',
      status: 'accepted',
      pickedUp: false,
      returned: false,
      meetupCode: 'AB7K'
    },
    {
      id: 2,
      item: 'Textbook - Chemistry 201',
      borrower: 'Mike T.',
      borrowerId: 'user_3',
      pickupLocation: 'Library',
      time: '3-5 pm',
      status: 'accepted',
      pickedUp: true,
      returned: false,
      meetupCode: 'XY3M'
    },
    {
      id: 3,
      item: 'Laptop Charger (HP)',
      borrower: 'Emma K.',
      borrowerId: 'user_4',
      pickupLocation: 'Student Center',
      time: '1-3 pm',
      status: 'completed',
      pickedUp: true,
      returned: true,
      meetupCode: 'PQ8N'
    }
  ]);

  const handleConfirmPickup = (loaningId) => {
    setLoanings(loanings.map(l => 
      l.id === loaningId ? { ...l, pickedUp: true } : l
    ));
  };

  const handleConfirmReturn = (loaningId) => {
    setLoanings(loanings.map(l => 
      l.id === loaningId ? { ...l, returned: true, status: 'completed' } : l
    ));
    alert('You earned 5 credits! Thanks for helping out.');
  };

  const handleCancelLoaning = (loaningId) => {
    if (window.confirm('Are you sure you want to cancel this loaning?')) {
      setLoanings(loanings.filter(l => l.id !== loaningId));
    }
  };

  const handleOpenChat = (userId, userName) => {
    setSelectedChatUser({ id: userId, name: userName });
    setShowChatModal(true);
    if (!chatMessages[userId]) {
      setChatMessages({ ...chatMessages, [userId]: [] });
    }
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !selectedChatUser) return;
    
    const newMessage = {
      id: Date.now(),
      text: currentMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages({
      ...chatMessages,
      [selectedChatUser.id]: [...(chatMessages[selectedChatUser.id] || []), newMessage]
    });
    setCurrentMessage('');
  };

  const handleOpenReport = (loaning) => {
    setReportingLoaning(loaning);
    setShowReportModal(true);
  };

  const handleSubmitReport = () => {
    if (!reportData.issue || !reportData.description) {
      alert('Please fill in all required fields');
      return;
    }
    
    alert('Report submitted successfully. Our team will review it shortly.');
    setShowReportModal(false);
    setReportData({ issue: '', description: '', photosWanted: false });
    setReportingLoaning(null);
  };

  const getFilteredLoanings = () => {
    if (loaningFilter === 'active') {
      return loanings.filter(l => l.status !== 'completed');
    } else if (loaningFilter === 'finished') {
      return loanings.filter(l => l.status === 'completed');
    }
    return loanings;
  };

  const filteredLoanings = getFilteredLoanings();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '1rem',
      paddingBottom: '5rem'
    }}>
      {/* Header */}
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#1f2937'
      }}>My Loanings</h1>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        <button 
          onClick={() => setLoaningFilter('active')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: loaningFilter === 'active' ? '#9333ea' : '#e5e7eb',
            color: loaningFilter === 'active' ? 'white' : '#6b7280'
          }}
        >
          Active
        </button>
        <button 
          onClick={() => setLoaningFilter('finished')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: loaningFilter === 'finished' ? '#9333ea' : '#e5e7eb',
            color: loaningFilter === 'finished' ? 'white' : '#6b7280'
          }}
        >
          Finished
        </button>
      </div>

      {/* Loanings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredLoanings.map(loan => (
          <div key={loan.id} style={{
            backgroundColor: 'white',
            borderRadius: '1.5rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937'
              }}>{loan.item}</h3>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '500',
                backgroundColor: loan.status === 'completed' ? '#d1fae5' : '#fef3c7',
                color: loan.status === 'completed' ? '#065f46' : '#92400e'
              }}>
                {loan.status === 'completed' ? 'Completed' : loan.pickedUp ? 'Item Out' : 'Pending Pickup'}
              </span>
            </div>

            {/* Details */}
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>
                Borrower: {loan.borrower}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>
                Location: {loan.pickupLocation}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                Time: {loan.time}
              </p>
            </div>

            {/* Meetup Code */}
            <div style={{
              backgroundColor: '#f9fafb',
              border: '2px solid #e5e7eb',
              borderRadius: '1rem',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '0.25rem'
              }}>Your Meetup Code:</p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#1f2937',
                letterSpacing: '0.1em'
              }}>{loan.meetupCode}</p>
            </div>
            
            {/* Action Buttons */}
            {loan.status !== 'completed' && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {!loan.pickedUp && (
                  <button 
                    onClick={() => handleConfirmPickup(loan.id)}
                    style={{
                      flex: '1',
                      minWidth: '150px',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <CheckCircle size={20} />
                    Confirm Pickup
                  </button>
                )}
                {loan.pickedUp && !loan.returned && (
                  <button 
                    onClick={() => handleConfirmReturn(loan.id)}
                    style={{
                      flex: '1',
                      minWidth: '150px',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#9333ea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <CheckCircle size={20} />
                    Confirm Return
                  </button>
                )}
                <button 
                  onClick={() => handleOpenChat(loan.borrowerId, loan.borrower)}
                  style={{
                    flex: '1',
                    minWidth: '120px',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'white',
                    color: '#9333ea',
                    border: '2px solid #9333ea',
                    borderRadius: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <MessageCircle size={20} />
                  Chat
                </button>
                <button 
                  onClick={() => handleOpenReport(loan)}
                  style={{
                    flex: '1',
                    minWidth: '140px',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'white',
                    color: '#dc2626',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Report Issue
                </button>
                <button 
                  onClick={() => handleCancelLoaning(loan.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'white',
                    color: '#6b7280',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            {loan.status === 'completed' && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleOpenChat(loan.borrowerId, loan.borrower)}
                  style={{
                    flex: '1',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'white',
                    color: '#9333ea',
                    border: '2px solid #9333ea',
                    borderRadius: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <MessageCircle size={20} />
                  View Chat
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredLoanings.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          backgroundColor: 'white',
          borderRadius: '1.5rem'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            backgroundColor: '#f3e8ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <MessageCircle size={40} color="#9333ea" />
          </div>
          <p style={{ fontSize: '1rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>
            No {loaningFilter} loanings
          </p>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            Help someone out to earn credits!
          </p>
        </div>
      )}

      {/* Chat Modal */}
      <Modal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        title={selectedChatUser ? `Chat with ${selectedChatUser.name}` : 'Chat'}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '320px',
          border: '1px solid #e5e7eb',
          borderRadius: '1rem',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{
            flex: '1',
            overflowY: 'auto',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {(chatMessages[selectedChatUser?.id] || []).length === 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#9ca3af',
                fontSize: '0.875rem'
              }}>
                No messages yet. Start the conversation!
              </div>
            ) : (
              (chatMessages[selectedChatUser?.id] || []).map(msg => (
                <div
                  key={msg.id}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.75rem',
                    maxWidth: '75%',
                    alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.sender === 'me' ? '#ddd6fe' : 'white',
                    border: msg.sender === 'me' ? 'none' : '1px solid #e5e7eb'
                  }}
                >
                  <p style={{ fontSize: '0.875rem', color: '#1f2937' }}>{msg.text}</p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                    {msg.timestamp}
                  </p>
                </div>
              ))
            )}
          </div>

          <div style={{
            display: 'flex',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: 'white',
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem'
          }}>
            <input
              type="text"
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{
                flex: '1',
                padding: '0.5rem',
                outline: 'none',
                border: 'none',
                borderBottomLeftRadius: '1rem'
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: '0 1rem',
                color: '#9333ea',
                fontWeight: '600',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </div>
      </Modal>

      {/* Report Issue Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setReportData({ issue: '', description: '', photosWanted: false });
          setReportingLoaning(null);
        }}
        title="Report an Issue"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '0.75rem',
            padding: '0.75rem'
          }}>
            <p style={{ fontSize: '0.875rem', color: '#92400e' }}>
              <strong>Note:</strong> If your report is verified, the borrower will be charged for damages or replacement costs.
            </p>
          </div>

          {reportingLoaning && (
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '0.75rem',
              padding: '0.75rem'
            }}>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                Item: <strong>{reportingLoaning.item}</strong>
              </p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                Borrower: <strong>{reportingLoaning.borrower}</strong>
              </p>
            </div>
          )}

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>What happened?</label>
            <select
              value={reportData.issue}
              onChange={(e) => setReportData({ ...reportData, issue: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '1rem'
              }}
            >
              <option value="">Select an issue</option>
              <option value="damaged">Item was damaged</option>
              <option value="stolen">Item was not returned / stolen</option>
              <option value="late">Item returned very late</option>
              <option value="different">Item returned in different condition</option>
              <option value="other">Other issue</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>Description</label>
            <textarea
              placeholder="Please describe the issue in detail..."
              value={reportData.description}
              onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={reportData.photosWanted}
                onChange={(e) => setReportData({ ...reportData, photosWanted: e.target.checked })}
                style={{
                  width: '1rem',
                  height: '1rem',
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                I can provide photos as evidence
              </span>
            </label>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '1.5rem'
        }}>
          <button 
            onClick={() => {
              setShowReportModal(false);
              setReportData({ issue: '', description: '', photosWanted: false });
              setReportingLoaning(null);
            }}
            style={{
              flex: '1',
              padding: '0.75rem 1rem',
              backgroundColor: 'white',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmitReport}
            style={{
              flex: '1',
              padding: '0.75rem 1rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Submit Report
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default LoaningPage;