import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, DollarSign, Tag, MapPin, Info, Check } from 'lucide-react';

const AddItemPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
    images: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    // In a real app, you would upload the images to a server
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit the form
      console.log('Form submitted:', formData);
      // In a real app, you would send the data to your backend
      navigate('/items');
    }
  };

  return (
    <div style={{ padding: '1rem', paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginRight: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: '#f3f4f6'
            }
          }}
        >
          <ArrowLeft size={24} color="#1f2937" />
        </button>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          margin: 0,
          color: '#1f2937'
        }}>
          {step === 1 ? 'Add New Item' : step === 2 ? 'Pricing & Location' : 'Review & Submit'}
        </h1>
      </div>

      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '12px',
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: '#e5e7eb',
          zIndex: 1
        }
      }}>
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: step >= stepNumber ? '#9333ea' : '#e5e7eb',
              color: step >= stepNumber ? 'white' : '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.5rem',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              {step > stepNumber ? <Check size={16} /> : stepNumber}
            </div>
            <span style={{
              fontSize: '0.75rem',
              color: step >= stepNumber ? '#9333ea' : '#9ca3af',
              fontWeight: step === stepNumber ? '600' : '400',
              textAlign: 'center'
            }}>
              {stepNumber === 1 ? 'Details' : stepNumber === 2 ? 'Pricing' : 'Review'}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            {/* Image Upload */}
            <div style={{
              marginBottom: '1.5rem'
            }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Photos
              </label>
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '0.75rem',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: formData.images.length > 0 ? 'transparent' : '#f9fafb',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                {formData.images.length === 0 ? (
                  <div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#f3e8ff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem'
                    }}>
                      <ImageIcon size={24} color="#9333ea" />
                    </div>
                    <p style={{
                      fontSize: '0.9375rem',
                      fontWeight: '500',
                      color: '#1f2937',
                      margin: '0 0 0.25rem'
                    }}>
                      Add Photos
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      Upload up to 10 high-quality photos
                    </p>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    justifyContent: 'center'
                  }}>
                    {formData.images.map((image, index) => (
                      <div key={index} style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '0.5rem',
                        backgroundColor: '#f3f4f6',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    ))}
                    {formData.images.length < 10 && (
                      <div style={{
                        width: '80px',
                        height: '80px',
                        border: '2px dashed #d1d5db',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f9fafb',
                        cursor: 'pointer'
                      }}>
                        <Plus size={24} color="#9ca3af" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What are you listing?"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  '&:focus': {
                    outline: 'none',
                    borderColor: '#9333ea',
                    ring: '0 0 0 2px rgba(147, 51, 234, 0.2)'
                  }
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your item in detail..."
                rows="4"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  resize: 'vertical',
                  '&:focus': {
                    outline: 'none',
                    borderColor: '#9333ea',
                    ring: '0 0 0 2px rgba(147, 51, 234, 0.2)'
                  }
                }}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Category
              </label>
              <div style={{ position: 'relative' }}>
                <Tag size={20} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    appearance: 'none',
                    backgroundColor: 'white',
                    '&:focus': {
                      outline: 'none',
                      borderColor: '#9333ea',
                      ring: '0 0 0 2px rgba(147, 51, 234, 0.2)'
                    }
                  }}
                >
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="books">Books</option>
                  <option value="clothing">Clothing</option>
                  <option value="furniture">Furniture</option>
                  <option value="sports">Sports & Outdoors</option>
                  <option value="other">Other</option>
                </select>
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {/* Price */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Daily Rate
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={20} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    '&:focus': {
                      outline: 'none',
                      borderColor: '#9333ea',
                      ring: '0 0 0 2px rgba(147, 51, 234, 0.2)'
                    }
                  }}
                />
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  / day
                </div>
              </div>
            </div>

            {/* Location */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Pickup Location
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={20} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Where can borrowers pick up the item?"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    '&:focus': {
                      outline: 'none',
                      borderColor: '#9333ea',
                      ring: '0 0 0 2px rgba(147, 51, 234, 0.2)'
                    }
                  }}
                />
              </div>
            </div>

            {/* Availability */}
            <div style={{
              backgroundColor: '#f0f9ff',
              borderRadius: '0.75rem',
              padding: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <Info size={20} color="#0ea5e9" style={{ flexShrink: 0 }} />
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#0369a1',
                  margin: '0 0 0.25rem'
                }}>
                  Set your availability
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#0c4a6e',
                  margin: 0
                }}>
                  By default, your item will be available every day. You can set specific availability in the next step.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: '0 0 1rem',
                color: '#1f2937',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid #f3f4f6'
              }}>
                Review Your Listing
              </h3>
              
              {formData.images.length > 0 && (
                <div style={{
                  width: '100%',
                  height: '200px',
                  borderRadius: '0.5rem',
                  backgroundColor: '#f3f4f6',
                  marginBottom: '1.5rem',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={URL.createObjectURL(formData.images[0])} 
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}
              
              <div style={{
                display: 'grid',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    margin: '0 0 0.25rem'
                  }}>
                    Title
                  </p>
                  <p style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    margin: 0,
                    color: '#1f2937'
                  }}>
                    {formData.title || 'No title provided'}
                  </p>
                </div>
                
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    margin: '0 0 0.25rem'
                  }}>
                    Description
                  </p>
                  <p style={{
                    fontSize: '0.9375rem',
                    margin: 0,
                    color: '#4b5563',
                    lineHeight: '1.5'
                  }}>
                    {formData.description || 'No description provided'}
                  </p>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      margin: '0 0 0.25rem'
                    }}>
                      Category
                    </p>
                    <p style={{
                      fontSize: '0.9375rem',
                      fontWeight: '500',
                      margin: 0,
                      color: '#1f2937',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Tag size={16} color="#6b7280" />
                      {formData.category || 'Not specified'}
                    </p>
                  </div>
                  
                  <div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      margin: '0 0 0.25rem'
                    }}>
                      Daily Rate
                    </p>
                    <p style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      margin: 0,
                      color: '#1f2937',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      ${formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 'normal',
                        color: '#6b7280'
                      }}>
                        / day
                      </span>
                    </p>
                  </div>
                  
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      margin: '0 0 0.25rem'
                    }}>
                      Pickup Location
                    </p>
                    <p style={{
                      fontSize: '0.9375rem',
                      margin: 0,
                      color: '#4b5563',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <MapPin size={16} color="#6b7280" />
                      {formData.location || 'No location specified'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                padding: '1rem',
                fontSize: '0.75rem',
                color: '#4b5563',
                lineHeight: '1.5'
              }}>
                <p style={{ margin: '0 0 0.5rem' }}>
                  <strong>Note:</strong> Your item will be reviewed by our team before going live. This usually takes 24-48 hours.
                </p>
                <p style={{ margin: 0 }}>
                  By submitting, you agree to our Terms of Service and confirm that this item is safe and legal to rent.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            backgroundColor: '#9333ea',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: '#7e22ce'
            },
            '&:active': {
              backgroundColor: '#6b21a8'
            },
            '&:disabled': {
              backgroundColor: '#e5e7eb',
              cursor: 'not-allowed'
            }
          }}
          disabled={!formData.title || !formData.description || !formData.category || (step >= 2 && (!formData.price || !formData.location))}
        >
          {step < 3 ? 'Continue' : 'Publish Listing'}
        </button>
      </form>
    </div>
  );
};

export default AddItemPage;
