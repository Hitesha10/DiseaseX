import React, { Component } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import GetAllDiseases from '../api/diseases/getAllDiseases';
import Background from '../images/background.jpg';

//var sectionStyle = {
  //backgroundImage: 'url(' + Background + ')',
  //backgroundPosition: 'center',
  //backgroundSize: 'cover',
//};

var sectionStyle = {
  //backgroundImage: 'url(' + Background + ')',
  backgroundColor: '#E1CDD6',
  width: '100%',
  height: '100vh',
  overflowY: 'auto',
  overflowX: 'auto',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
};

class Health_center extends Component {
  state = {
    diseases: [],
    user: {},
    barChart: [],
  };

  componentDidMount() {
    var user = JSON.parse(localStorage.getItem('user'));
    this.setState({ user: user });

    try {
      GetAllDiseases()
        .then((response) => {
          this.setState({ diseases: response.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log('Server' + err);
    }
  }

  render() {
    return (
      <div style={sectionStyle}>
        <div className='row'>
          <div
            style={{
              width: '50%',
              height: '50%',
              justifyContent: 'center',
              paddingLeft: '5%',
            }}
          >
            <Bar
              data={{
                labels: ['Infected', 'Recovered', 'Deaths'],
                datasets: [
                  {
                    label: 'People',
                    borderWidth: 2,
                    backgroundColor: [
                      'rgba(0, 0, 255, 0.5)',
                      'rgba(0, 255, 0, 0.5)',
                      'rgba(255, 0, 0, 0.5)',
                    ],
                    hoverBackgroundColor: ['blue', 'green', 'red'],
                    position: 'center',
                    data: [
                      this.state.user.total_affected,
                      this.state.user.total_recovered,
                      this.state.user.total_deaths,
                    ],
                  },
                ],
              }}
              options={{
                title: {
                  display: true,
                  position: 'top',
                  text: `HEALTH CENTER : ${this.state.user.name} status`,
                  fontSize: '20',
                  fontColor: 'black',
                },
                legend: {
                  display: false,
                  position: 'right',
                },
              }}
            />
          </div>

          <div
            className='btn-group mr-7'
            role='group'
            aria-label='First group'
            style={{ paddingLeft: '8%', paddingTop: '5%', height: '2%' }}
          >
            <a className='btn btn-large btn-dark' href='/new_humancase'>
              NEW HUMAN CASE
            </a>
            <a className='btn btn-large btn-dark' href='/new_animalcase'>
              NEW ANIMAL CASE
            </a>
            <a className='btn btn-large btn-dark' href='/human_case'>
              HUMAN CASES
            </a>
            <a className='btn btn-large btn-dark' href='/animal_case'>
              ANIMAL CASES
            </a>
          </div>
        </div>
        <div className='row'>
          {' '}
          {this.state.diseases.map((dise) => {
            return (
              <div
                style={{ width: '25%', height: '25%', paddingTop: '3%' }}
                key={dise._id}
              >
                <Doughnut
                  data={{
                    labels: ['Infected', 'Recoverd', 'Deaths'],
                    datasets: [
                      {
                        label: 'Rainfall',
                        backgroundColor: [
                          'rgba(0, 0, 255, 0.7)',
                          'rgba(0, 255, 0, 0.7)',
                          'rgba(255, 0, 0, 0.7)',
                        ],
                        hoverBackgroundColor: ['blue', 'green', 'red'],
                        data: [
                          dise.total_affected,
                          dise.total_recovered,
                          dise.total_deaths,
                        ],
                      },
                    ],
                  }}
                  options={{
                    title: {
                      display: true,
                      text: dise.name,
                      fontColor: 'black',
                      fontSize: 15,
                      position: 'top',
                    },
                    legend: {
                      display: true,
                      fontColor: 'black',
                      fontSize: '2',
                      position: 'right',
                    },
                    labels: {
                      fontColor: 'black',
                    },
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Health_center;
