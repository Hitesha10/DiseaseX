import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Loading from './loading/loading.jsx';
import getAllDiseases from '../api/diseases/getAllDiseases.jsx';
import Dropdown from './dropdown/Dropdown.jsx';
import UpdateHealthCenter from '../api/healthCenters/updatehealthCenter.jsx';
import addDisease from '../api/diseases/postDisease.jsx';
import addAnimalCase from '../api/animalCase/createAnimalCase.jsx';
var sectionStyle = {
  //backgroundImage: 'url(' + Background + ')',
  backgroundColor: 'rgb(162,128,137,0.95)',
  width: '100%',
  height: '100vh',
  overflowY: 'auto',
  overflowX: 'auto',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
};

function NewAnimalCase() {
  let history = useHistory();
  const [loading, setLoading] = React.useState('');
  const [ownerName, setOwnerName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [pinCode, setPinCode] = React.useState('');
  const [breed, setBreed] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [diseases, setDiseases] = React.useState([]);
  const [disease, setDisease] = React.useState('');
  const [diseaseName, setDiseaseName] = React.useState('');
  const [symptoms, setSymptoms] = React.useState('');
  const [vaccines, setVaccines] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [error, setError] = React.useState({
    nameError: '',
    emailError: '',
    addressError: '',
    pinCodeError: '',
    contactError: '',
    breedError: '',
    statusError: '',
    diseaseError: '',
    diseaseNameError: '',
    sumptomsError: '',
    vaccinesError: '',
    durationError: '',
    overAllError: '',
  });
  const statuses = ['infected', 'recovered', 'deceased'];
  useEffect(() => {
    try {
      setLoading(true);
      getAllDiseases()
        .then((response) => {
          setDiseases(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError((error) => ({
            ...error,
            overAllError: 'Unable to fetch data!',
          }));
          setLoading(false);
        });
    } catch (err) {
      setError((error) => ({
        ...error,
        overAllError: err,
      }));
    }
  }, []);
  function handleSubmit(event) {
    event.preventDefault();
    if (
      !ownerName ||
      !email ||
      !contact ||
      !address ||
      !pinCode ||
      !breed ||
      !status ||
      !disease
    ) {
      setError((error) => ({
        ...error,
        overAllError: 'Please enter the required Values!',
      }));
      return;
    }
    if (disease === 'Other') {
      if (!diseaseName || !symptoms || !vaccines || !duration) {
        setError((error) => ({
          ...error,
          overAllError: 'Please enter the New Disease details!',
        }));
        return;
      }
    }
    let healthcenter = JSON.parse(localStorage.getItem('user'));
    if (status === 'infected') {
      healthcenter.total_affected = healthcenter.total_affected + 1;
    } else if (status === 'recovered') {
      healthcenter.total_recovered = healthcenter.total_recovered + 1;
    } else {
      healthcenter.total_deaths = healthcenter.total_deaths + 1;
    }
    localStorage.setItem('user', JSON.stringify(healthcenter));
    if (disease !== 'Other') {
      let tempDisease = diseases.filter(
        (diseaseVal) => diseaseVal.name === disease
      );

      let animalcase = {
        animal: {
          status: status,
          livestock: { breed: breed },
          owner: {
            name: ownerName,
            address: address,
            pincode: pinCode,
            email: email,
            contact: contact,
          },
          vaccine: {
            name: tempDisease[0].vaccine[0].name,
            duration: tempDisease[0].vaccine[0].duration,
          },
        },
        healthCenter: healthcenter,
        disease: tempDisease[0],
      };

      try {
        setLoading(true);
        UpdateHealthCenter(healthcenter)
          .then((response) => {
            addAnimalCase(animalcase)
              .then((response) => {
                history.push(`/animal_case`);
                setLoading(false);
              })
              .catch((err) => {
                setError((error) => ({
                  ...error,
                  overAllError:
                    'Unable to Register the Case! Please try Again!',
                }));
                setLoading(false);
              });
          })
          .catch((err) => {
            setError((error) => ({
              ...error,
              overAllError: 'Unable to Register the Case! Please try Again!',
            }));
            setLoading(false);
          });
      } catch (err) {
        setError((error) => ({
          ...error,
          overAllError: err,
        }));
      }
    } else {
      let newDisease = {
        name: diseaseName,
        symptoms: symptoms,
        livestock: [{ breed: breed }],
        vaccine: [{ name: vaccines, duration: parseInt(duration) }],
      };
      let animalcase = {
        animal: {
          status: status,
          livestock: { breed: breed },
          owner: {
            name: ownerName,
            address: address,
            pincode: pinCode,
            email: email,
            contact: contact,
          },
          vaccine: { name: vaccines, duration: parseInt(duration) },
        },
        healthCenter: healthcenter,
        disease: newDisease,
      };

      try {
        setLoading(true);
        UpdateHealthCenter(healthcenter)
          .then((response) => {
            addAnimalCase(animalcase)
              .then((response) => {
                addDisease(newDisease)
                  .then((response) => {
                    history.push(`/animal_case`);
                    setLoading(false);
                  })
                  .catch((err) => {
                    setError((error) => ({
                      ...error,
                      overAllError:
                        'Unable to Register the Case! Please try Again!',
                    }));
                    setLoading(false);
                  });
              })
              .catch((err) => {
                setError((error) => ({
                  ...error,
                  overAllError:
                    'Unable to Register the Case! Please try Again!',
                }));
                setLoading(false);
              });
          })
          .catch((err) => {
            setError((error) => ({
              ...error,
              overAllError: 'Unable to Register the Case! Please try Again!',
            }));
            setLoading(false);
          });
      } catch (err) {
        setError((error) => ({
          ...error,
          overAllError: err,
        }));
      }
    }
  }
  return (
    <div className='container-fluid p-0' style={sectionStyle}>
      {localStorage.user ? (
        <div>
          {loading ? (
            <div
              style={{
                height: '80vh',
              }}
              className='d-flex align-items-center justify-content-center'
            >
              <Loading />
            </div>
          ) : (
            <div
              className='card '
              body='true'
              inverse='true'
              style={{
                marginLeft: '20%',
                marginRight: '20%',
                justifyContent: 'center',

                backgroundColor: 'rgba(0,0,0,0.30)',
                borderColor: '#333',
              }}
            >
              <div className='card-header'>
                <h3>New Animal Case</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className='card-body'>
                  <div className='d-flex align-items-center'>
                    <div className='flex-fill pr-3'>
                      <div className='form-group '>
                        <label htmlFor='name'>Owner Name</label>
                        <input
                          type='text'
                          id='name'
                          autoComplete='off'
                          required
                          className='form-control'
                          onChange={(event) => {
                            setOwnerName(event.target.value);
                            setError((error) => ({ ...error, nameError: '' }));
                          }}
                          onBlur={() =>
                            ownerName.length === 0
                              ? setError((error) => ({
                                  ...error,
                                  nameError: 'Field cannot be empty',
                                }))
                              : null
                          }
                          placeholder='Enter Name of Owner'
                        />
                        {error.nameError ? (
                          <div className='errorLabel'>
                            <p className='p-0'>{error.nameError}</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className='flex-fill pr-3'>
                      <div className='form-group'>
                        <label htmlFor='email'>Email address</label>
                        <input
                          type='email'
                          required
                          id='email'
                          autoComplete='off'
                          className='form-control'
                          placeholder='Enter Owner email'
                          onChange={(event) => {
                            setEmail(event.target.value);
                            setError((error) => ({ ...error, emailError: '' }));
                          }}
                          onBlur={() =>
                            email.length === 0
                              ? setError((error) => ({
                                  ...error,
                                  emailError: 'Enter a valid Email',
                                }))
                              : null
                          }
                        />
                        {error.emailError ? (
                          <div className='errorLabel'>
                            <p className='p-0'>{error.emailError}</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className='flex-fill'>
                      <div className='form-group'>
                        <label htmlFor='contact'>Owner Contact</label>
                        <input
                          type='number'
                          required
                          id='contact'
                          autoComplete='off'
                          className='form-control'
                          placeholder='Enter Owner Contact Number'
                          onChange={(event) => {
                            setContact(event.target.value);
                            setError((error) => ({
                              ...error,
                              contactError: '',
                            }));
                          }}
                          onBlur={() =>
                            contact[0] === 0
                              ? setError((error) => ({
                                  ...error,
                                  contactError:
                                    'please exclude zero from starting',
                                }))
                              : contact.length > 10 || contact.length === 0
                              ? setError((error) => ({
                                  ...error,
                                  contactError:
                                    'Please enter a valid phone number',
                                }))
                              : null
                          }
                        />
                        {error.contactError ? (
                          <div className='errorLabel'>
                            <p className='p-0'>{error.contactError}</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className='d-flex align-items-center justify-content-center'>
                    <div className='form-group pr-3' style={{ width: '75%' }}>
                      <label htmlFor='address'>Owner Address</label>
                      <input
                        type='text'
                        id='address'
                        autoComplete='off'
                        className='form-control'
                        placeholder='Enter Owner Address'
                        onChange={(event) => {
                          setAddress(event.target.value);
                          setError((error) => ({
                            ...error,
                            addressError: '',
                          }));
                        }}
                        onBlur={() =>
                          address.length === 0
                            ? setError((error) => ({
                                ...error,
                                addressError: 'Cannot be empty',
                              }))
                            : null
                        }
                      />
                    </div>
                    {error.addressError ? (
                      <div className='errorLabel'>
                        <p className='p-0'>{error.addressError}</p>
                      </div>
                    ) : null}
                    <div className='form-group'>
                      <label htmlFor='pinCode'>Pin Code</label>
                      <input
                        type='text'
                        id='pinCode'
                        autoComplete='off'
                        className='form-control'
                        placeholder='PinCode'
                        onChange={(event) => {
                          setPinCode(event.target.value);
                          setError((error) => ({
                            ...error,
                            pinCodeError: '',
                          }));
                        }}
                        onBlur={() =>
                          pinCode.length === 0
                            ? setError((error) => ({
                                ...error,
                                pinCodeError: 'Please enter a valid PinCode',
                              }))
                            : null
                        }
                      />
                      {error.pinCodeError ? (
                        <div className='errorLabel'>
                          <p className='p-0'>{error.pinCodeError}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className='d-flex align-items-center'>
                    <div className=' pr-3' style={{ width: '38%' }}>
                      <div className='form-group '>
                        <label htmlFor='breed'>Animal Breed</label>
                        <input
                          type='text'
                          id='breed'
                          autoComplete='off'
                          required
                          className='form-control'
                          onChange={(event) => {
                            setBreed(event.target.value);
                            setError((error) => ({ ...error, breedError: '' }));
                          }}
                          onBlur={() =>
                            breed.length === 0
                              ? setError((error) => ({
                                  ...error,
                                  breedError: 'Field cannot be empty',
                                }))
                              : null
                          }
                          placeholder='Enter Animal Breed'
                        />
                        {error.breedError ? (
                          <div className='errorLabel'>
                            <p className='p-0'>{error.breedError}</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className='pr-3 pb-3' style={{ width: '38%' }}>
                      <Dropdown
                        label='Disease'
                        hasError={error.diseaseError}
                        categories={diseases.map((val) => val.name)}
                        selectedItem={(item) => {
                          setDisease(item);
                          setError((error) => ({
                            ...error,
                            diseaseError: '',
                          }));
                        }}
                      />
                      {error.diseaseError ? (
                        <div className='errorLabel'>
                          <p className='p-0'>{error.diseaseError}</p>
                        </div>
                      ) : null}
                    </div>
                    <div className='pb-3' style={{ width: '24%' }}>
                      <Dropdown
                        label='Status'
                        hasError={error.statusError}
                        categories={statuses}
                        selectedItem={(item) => {
                          setStatus(item);
                          setError((error) => ({
                            ...error,
                            statusError: '',
                          }));
                        }}
                      />
                      {error.statusError ? (
                        <div className='errorLabel'>
                          <p className='p-0'>{error.statusError}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {disease === 'Other' ? (
                    <div>
                      <div className='d-flex align-items-center'>
                        <div
                          className='form-group pr-3'
                          style={{ width: '50%' }}
                        >
                          <label htmlFor='DiseaseName'>Disease Name</label>
                          <input
                            type='text'
                            id='DiseaseName'
                            autoComplete='off'
                            required
                            className='form-control'
                            placeholder='Enter the disease of Patient'
                            onChange={(event) => {
                              setDiseaseName(event.target.value);
                              setError((error) => ({
                                ...error,
                                diseaseNameError: '',
                              }));
                            }}
                            onBlur={() =>
                              diseaseName.length === 0
                                ? setError((error) => ({
                                    ...error,
                                    diseaseNameError:
                                      'Please enter the disease of the Registering Case!',
                                  }))
                                : null
                            }
                          />
                          {error.diseaseNameError ? (
                            <div className='errorLabel'>
                              <p className='p-0'>{error.diseaseNameError}</p>
                            </div>
                          ) : null}
                        </div>
                        <div className='form-group' style={{ width: '50%' }}>
                          <label htmlFor='symptoms'>Symptoms</label>
                          <input
                            type='text'
                            id='symptoms'
                            autoComplete='off'
                            required
                            className='form-control'
                            placeholder='Add coma seperated list of symptoms'
                            onChange={(event) => {
                              setSymptoms(event.target.value);
                              setError((error) => ({
                                ...error,
                                symptomsError: '',
                              }));
                            }}
                            onBlur={() =>
                              symptoms.length === 0
                                ? setError((error) => ({
                                    ...error,
                                    symptomsError:
                                      'Atleast one symptom should be added!',
                                  }))
                                : null
                            }
                          />
                          {error.symptomsError ? (
                            <div className='errorLabel'>
                              <p className='p-0'>{error.symptomsError}</p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className='d-flex align-items-center justify-content-center'>
                        <div
                          className='form-group pr-3'
                          style={{ width: '75%' }}
                        >
                          <label htmlFor='vaccines'>Vaccines</label>
                          <input
                            type='text'
                            id='vaccines'
                            autoComplete='off'
                            className='form-control'
                            placeholder='Enter any Vaccine for the disease!'
                            onChange={(event) => {
                              setVaccines(event.target.value);
                              setError((error) => ({
                                ...error,
                                vaccinesError: '',
                              }));
                            }}
                            onBlur={() =>
                              vaccines.length === 0
                                ? setError((error) => ({
                                    ...error,
                                    vaccinesError: 'Cannot be empty',
                                  }))
                                : null
                            }
                          />
                          {error.vaccinesError ? (
                            <div className='errorLabel'>
                              <p className='p-0'>{error.vaccinesError}</p>
                            </div>
                          ) : null}
                        </div>
                        <div className='form-group'>
                          <label htmlFor='duration'>Duration</label>
                          <input
                            type='number'
                            id='duration'
                            min={0}
                            autoComplete='off'
                            className='form-control'
                            placeholder='Enter Duration in Days'
                            onChange={(event) => {
                              setDuration(event.target.value);
                              setError((error) => ({
                                ...error,
                                durationError: '',
                              }));
                            }}
                            onBlur={() =>
                              duration.length === 0 || duration === 0
                                ? setError((error) => ({
                                    ...error,
                                    durationError:
                                      'Please enter a non-zero value!',
                                  }))
                                : null
                            }
                          />
                          {error.durationError ? (
                            <div className='errorLabel'>
                              <p className='p-0'>{error.durationError}</p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className='card-footer d-flex align-items-center flex-column'>
                  {error.overAllError ? (
                    <div className=' float-left errorLabel'>
                      <p className='p-0 '>{error.overAllError}</p>
                    </div>
                  ) : null}
                  <div className='ml-auto'>
                    <button
                      type='submit'
                      width='150px'
                      className='btn btn-primary btn-block'
                    >
                      Register
                    </button>
                  </div>

                  <div className='ml-auto'>
                    <p className='forgot-password text-right'>
                      <a href='/animal_case'>All Cases? </a>

                      <a href='/new_humancase'>Add Human Case?</a>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default NewAnimalCase;
