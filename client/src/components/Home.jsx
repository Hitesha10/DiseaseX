import React, { PureComponent } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';
import './cars.css';
import { Button } from 'reactstrap';
import image1 from '../images/hc1.jpg';
import image2 from '../images/adminpc.jpg';
class Home extends PureComponent {
  render() {
    return (
      <div
        className='container-fluid p-0 sticky-top'
        style={{ top: '0', marginBottom: '10%', height: '30px' }}
        id='carouselExampleControls'
        class='carousel slide'
        data-ride='carousel'
      >
        <div className='carousel-inner'>
          <div className='carousel-item active fixed'>
            <img
              className='d-block w-100'
              src={image1}
              alt='First slide'
              style={{ height: '641px', objectFit: 'cover' }}
            />
            <div class='carousel-caption d-none d-md-block black'>
              <h4 style={{ textEmphasisColor: 'black' }}>
                Update your health center details
              </h4>

              <a className='btn btn-lg btn-dark' href='/loginPage'>
                LOGIN
              </a>
            </div>
          </div>
          <div className='carousel-item'>
            <img
              className='d-block w-100'
              src={image2}
              alt='Second slide'
              style={{ height: '641px', objectFit: 'cover' }}
            />
            <div class='carousel-caption d-none d-md-block black'>
              <h4 style={{ textEmphasisColor: 'black' }}>
                Appearing as an ADMIN
              </h4>
              <a className='btn btn-lg btn-dark' href='/loginPageAdmin'>
                LOGIN
              </a>
            </div>
          </div>
          <div className='carousel-item'>
            <img className='d-block w-100' src='...' alt='Third slide' />
          </div>
        </div>
        <a
          className='carousel-control-prev'
          href='#carouselExampleControls'
          role='button'
          data-slide='prev'
        >
          <span
            className='carousel-control-prev-icon'
            aria-hidden='true'
          ></span>
          <span className='sr-only'>Previous</span>
        </a>
        <a
          className='carousel-control-next'
          href='#carouselExampleControls'
          role='button'
          data-slide='next'
        >
          <span
            className='carousel-control-next-icon'
            aria-hidden='true'
          ></span>
          <span className='sr-only'>Next</span>
        </a>
      </div>
    );
  }
}

export default Home;
