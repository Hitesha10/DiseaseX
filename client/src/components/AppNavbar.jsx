import React from 'react';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';
import { Navbar, NavbarBrand, Container } from 'reactstrap';


function AppNavBar() {
  let history = useHistory();
  const [logoutoption, setLogoutOption] = React.useState(true);
  return (
    <div className='container-fluid p-0 sticky-top' style={{marginBottom:'-40px'}}>
      <Navbar  expand='lm' className='mb-5 ' style={{backgroundColor :'black', text: 'white'}}>
        <Container>
          <NavbarBrand href={localStorage.user ? '/health_center' : '/'} style={{text: 'white'}}>
            DiseaseX
          </NavbarBrand>

          <div className='dropdown'>
            <div
              id='dropdownMenuButton'
              data-toggle='dropdown'
              aria-haspopup='true'
              aria-expanded='false'
            >
              <div
                className={`userSectionBackground d-flex justify-content-center align-items-center flex-column`}
              >
                <div className='menuBar mb-1' />
                <div className='menuBar mb-1' />
                <div className='menuBar' />
              </div>
            </div>
            <div
              className={` p-0 dropdown-menu dropdown-menu-right dropdownMenu`}
              aria-labelledby='dropdownMenuButton'
            >
              {localStorage.user ? (
                <div>
                  <div className={`flexContainer`}>
                    <div className={`mb-0 userName`}>
                      {JSON.parse(localStorage.user).name}
                    </div>
                    <div className={`mb-0 userEmail`}>
                      {JSON.parse(localStorage.user).email}
                    </div>
                  </div>

                  <hr className='divider' />

                  <div
                    onClick={() => {
                      localStorage.removeItem('user');
                      setLogoutOption(!logoutoption);
                      history.replace('/');
                    }}
                    className={`p-3 d-flex align-items-center justify-content-center  logOut`}
                  >
                    <p className={`mb-0`}>LogOut</p>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    history.push('/signup');
                  }}
                  className={`p-3 d-flex align-items-center justify-content-center  register`}
                >
                  <div> Register</div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Navbar>
    </div>
  );
}

export default AppNavBar;
