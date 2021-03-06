import React from 'react';
import Login from '../api/auth/loginHealthCenter.jsx';
import Loading from './loading/loading.jsx';
import { useHistory } from 'react-router-dom';
import getLoggedInDetails from '../api/auth/getloggedInHealthCenterData.jsx';
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

function LoginPageHealthcenter() {
  let history = useHistory();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState({
    emailError: '',
    passwordError: '',
    overAllError: '',
  });
  function handleFormSubmit(event) {
    event.preventDefault();
    if (!email || !password) {
      setError((error) => ({
        ...error,
        overAllError: 'Please enter the required Values!',
      }));
      return;
    }
    try {
      setLoading(true);
      let token = '';
      Login({
        email: email,
        password: password,
      })
        .then((response) => {
          setError((error) => ({
            ...error,
            nameError: '',
            emailError: '',
            overAllError: '',
          }));
          token = response.data.token;
          getLoggedInDetails({
            token: token,
          })
            .then((response) => {
              setLoading(false);
              localStorage.setItem('user', JSON.stringify(response.data));
              history.push('/health_center');
            })
            .catch((err) => {
              if (err.response) {
                setError((error) => ({
                  ...error,
                  overAllError: err.response.data.errors[0].msg,
                }));
              }
              setLoading(false);
            });
        })

        .catch((err) => {
          if (err.response) {
            setError((error) => ({
              ...error,
              overAllError: err.response.data.errors[0].msg,
            }));
          }
          setLoading(false);
        });
    } catch (err) {
      setError((error) => ({
        ...error,
        overAllError: err,
      }));
    }
  }
  return (
    <div className='container-fluid p-0' style={sectionStyle}>
      {!localStorage.user ? (
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
              className='card'
              body='true'
              inverse='true'
              style={{
                marginLeft: '20%',
                marginRight: '20%',
                marginTop: '5%',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.30)',
                borderColor: '#333',
              }}
            >
              <div className='card-header'>
                <h3>Health Center Sign In</h3>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className='card-body'>
                  <div className='form-group'>
                    <label htmlFor='email'>Email address</label>
                    <input
                      type='email'
                      required
                      id='email'
                      autoComplete='on'
                      className='form-control'
                      placeholder='Enter email'
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
                    <div className='errorLabel'>
                      <p className='p-0'>{error.emailError}</p>
                    </div>
                  </div>

                  <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <input
                      type='password'
                      id='password'
                      autoComplete='off'
                      required
                      className='form-control'
                      placeholder='Enter password'
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError((error) => ({ ...error, passwordError: '' }));
                      }}
                      onBlur={() =>
                        password.length < 6
                          ? setError((error) => ({
                              ...error,
                              passwordError:
                                'Password should be atleast 6 characters long!',
                            }))
                          : null
                      }
                    />
                    <div className='errorLabel'>
                      <p className='p-0'>{error.passwordError}</p>
                    </div>
                  </div>
                  {error.overAllError ? (
                    <div className=' float-left errorLabel'>
                      <p className='p-0 '>{error.overAllError}</p>
                    </div>
                  ) : null}
                  <div className='d-flex align-items-center flex-column'>
                    <div className='ml-auto'>
                      <button
                        type='submit'
                        style={{ width: '150px' }}
                        className='btn btn-primary btn-block'
                      >
                        Login
                      </button>
                    </div>

                    <div className='ml-auto'>
                      <p className='forgot-password p-0'>
                        Not registered <a href='/signup'>sign up?</a>
                      </p>
                    </div>
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

export default LoginPageHealthcenter;
