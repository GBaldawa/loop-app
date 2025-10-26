import React from 'react';
import { User, Edit, Star, Clock, Check, X, Settings, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    rating: 4.8,
    items: 12,
    memberSince: '2023-01-15'
  };

  const recentActivity = [
    { id: 1, type: 'rented', item: 'USB-C Charger', date: '2023-10-20', status: 'completed' },
    { id: 2, type: 'lent', item: 'Textbook - Chemistry', date: '2023-10-18', status: 'in-progress' },
    { id: 3, type: 'rented', item: 'Camera Lens', date: '2023-10-15', status: 'completed' },
  ];

  return (
    <div style={{ padding: '1rem', paddingBottom: '5rem' }}>
      {/* Profile Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#f3e8ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '1rem'
        }}>
          <User size={40} color="#9333ea" />
        </div>
        <div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            margin: '0 0 0.25rem',
            color: '#1f2937'
          }}>{user.name}</h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0 0 0.5rem'
          }}>{user.email}</p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fef3c7',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.5rem'
            }}>
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#92400e',
                marginLeft: '0.25rem'
              }}>{user.rating}</span>
            </div>
            <span style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>{user.items} items</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '1rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            margin: '0 0 0.25rem'
          }}>Items</p>
          <p style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: 0,
            color: '#1f2937'
          }}>{user.items}</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '1rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            margin: '0 0 0.25rem'
          }}>Rating</p>
          <p style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: 0,
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem'
          }}>
            {user.rating}
            <Star size={16} color="#f59e0b" fill="#f59e0b" />
          </p>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '1rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            margin: '0 0 0.25rem'
          }}>Member Since</p>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            margin: 0,
            color: '#1f2937'
          }}>
            {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        margin: '0 0 1rem',
        color: '#1f2937'
      }}>Recent Activity</h2>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {recentActivity.map(activity => (
          <div key={activity.id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem 0',
            borderBottom: '1px solid #f3f4f6',
            '&:last-child': {
              borderBottom: 'none',
              paddingBottom: 0
            },
            '&:first-child': {
              paddingTop: 0
            }
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#f3e8ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem',
              flexShrink: 0
            }}>
              {activity.type === 'rented' ? (
                <Clock size={20} color="#9333ea" />
              ) : (
                <User size={20} color="#9333ea" />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '0.9375rem',
                fontWeight: '500',
                margin: '0 0 0.25rem',
                color: '#1f2937'
              }}>
                {activity.type === 'rented' ? 'You rented ' : 'You lent '}
                <span style={{ fontWeight: '600' }}>{activity.item}</span>
              </p>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {activity.status === 'completed' ? (
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#10b981',
                    fontWeight: '500'
                  }}>
                    <Check size={14} style={{ marginRight: '0.25rem' }} />
                    Completed
                  </span>
                ) : (
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#f59e0b',
                    fontWeight: '500'
                  }}>
                    <Clock size={14} style={{ marginRight: '0.25rem' }} />
                    In Progress
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Settings */}
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        margin: '0 0 1rem',
        color: '#1f2937'
      }}>Account</h2>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1rem 0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '0.75rem 1rem',
          backgroundColor: 'transparent',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          fontSize: '0.9375rem',
          color: '#1f2937',
          '&:hover': {
            backgroundColor: '#f9fafb'
          }
        }}>
          <Settings size={20} style={{ marginRight: '0.75rem', color: '#6b7280' }} />
          Account Settings
        </button>
        <div style={{
          height: '1px',
          backgroundColor: '#f3f4f6',
          margin: '0.5rem 0'
        }} />
        <button style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '0.75rem 1rem',
          backgroundColor: 'transparent',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          fontSize: '0.9375rem',
          color: '#ef4444',
          '&:hover': {
            backgroundColor: '#f9fafb'
          }
        }}>
          <LogOut size={20} style={{ marginRight: '0.75rem' }} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
