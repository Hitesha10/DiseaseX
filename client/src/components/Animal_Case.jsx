import React, { Component, useState } from 'react';
import GetAllAnimalCases from '../api/animalCase/getAllAnimalCases.jsx';
import GetAllHealthCenters from '../api/healthCenters/getAllhealthCenter';
import UpdateAnimalCase from '../api/animalCase/updateAnimalCase.jsx';
import UpdateHealthCenter from '../api/healthCenters/updatehealthCenter';
import GetAllDiseases from '../api/diseases/getAllDiseases';
import UpdateDisease from '../api/diseases/updateDisease';

import 'bootstrap/dist/css/bootstrap.css';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

import editImage from '../images/edit.png';

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

class Animal_Case extends Component {
  state = {
    modal: false,
    name: '',
    cases: [],
    filtereddata: [],
    newvalue: '',
    prevvalue: '',
    user: '',
    ide: '',
    hcid: '',
    filtereddata1: '',
    filtereddata2: '',
  };

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.setState({ user: user });
    try {
      GetAllAnimalCases()
        .then((response) => {
          let extractdata = response.data;
          console.log(response);
          this.setState({ cases: response.data });
          this.setState({
            filtereddata: extractdata.filter((temp) => {
              return temp.healthCenter.email === this.state.user.email;
            }),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log('Server' + err);
    }

    try {
      GetAllHealthCenters()
        .then((response) => {
          let extractdata = response.data;
          console.log(response);
          this.setState({
            filtereddata2: extractdata.filter((temp) => {
              return temp.email === this.state.user.email;
            }),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log('Server' + err);
    }
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    this.setState({ newvalue: e.target.value });
  };
  handleClick = (e) => {
    this.setState({ ide: e.target.name });
    this.toggle();
  };
  handleSubmit = (event) => {
    event.preventDefault();
    console.log(`${this.state.hcid}`);

    console.log('we are here');
    console.log(`${this.state.ide}`);
    try {
      let obj = this.state.filtereddata[this.state.ide];
      let animal = this.state.filtereddata[this.state.ide].animal;
      let prev = this.state.filtereddata[this.state.ide].animal.status;
      let obj1 = this.state.filtereddata2[0];

      let a = this.state.filtereddata2[0].total_affected;
      let b = this.state.filtereddata2[0].total_recovered;
      let c = this.state.filtereddata2[0].total_deaths;
      let diseaseName = this.state.filtereddata[this.state.ide].disease.name;
      console.log(diseaseName);
      try {
        GetAllDiseases()
        .then((response) => {
          let extractdataa = response.data;
          console.log(response.data);
          this.setState({
            filtereddata1: extractdataa.filter((temp) => {
              return temp.name === diseaseName;
            }),
          });
        })
        .catch((err) => {
          console.log(err);
        }); 
      } catch (err) {
        console.log('Server' + err);
      }
      console.log('here');
      console.log(`${this.state.filtereddata1[0].name}`);  
      let obj2 = this.state.filtereddata1[0];
      
      let a_d = this.state.filtereddata1[0].total_affected;
      let b_d = this.state.filtereddata1[0].total_recovered;
      let c_d = this.state.filtereddata1[0].total_deaths;
      
      console.log(`${a} ${b} ${c}`);
      if (this.state.newvalue !== '') {
        if (prev === 'infected' || prev === 'Infected') {
          a--;
          a_d--;
        }
        if (prev === 'recovered' || prev === 'Recovered') {
          b--;
          b_d--;
        }
        if (prev === 'deceased' || prev === 'Deceased') {
          c--;
          c_d--;
        }
        if (
          this.state.newvalue === 'infected' ||
          this.state.newvalue === 'Infected'
        ) {
          a++;
          a_d++;
        }
        if (
          this.state.newvalue === 'recovered' ||
          this.state.newvalue === 'Recovered'
        ) {
          b++;
          b_d++;
        }
        if (
          this.state.newvalue === 'deceased' ||
          this.state.newvalue === 'Deceased'
        ) {
          c++;
          c_d++;
        }
        obj = {
          ...obj,
          animal: {
            ...animal,
            status: this.state.newvalue,
          },
        };
      } else {
        obj = {
          ...obj,
        };
      }
      console.log(`${a} ${b} ${c}`);
      obj1 = {
        ...obj1,
        total_affected: a,
        total_recovered: b,
        total_deaths: c,
      };

      UpdateAnimalCase(obj)
        .then((response) => {
          console.log('Success Update');
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });

      UpdateHealthCenter(obj1)
        .then((response) => {
          console.log('Success Update');
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
      obj2 = {
        ...obj2,
        total_affected: a_d,
        total_recovered: b_d,
        total_deaths: c_d,
      };

      UpdateDisease(obj2)
        .then((response) => {
          console.log('Success Update');
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });


    } catch (err) {
      console.log('Server' + err);
    }
    this.toggle();
  };

  render() {
    return (
      <div style={sectionStyle}>
        <table class='table table-striped table-active'>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Owner Name</th>
              <th>Owner's Email</th>
              <th>Contact No.</th>
              <th>Disease Name</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {this.state.filtereddata.map((experience, i) => {
              return (
                <tr>
                  <th scope='row'>{i + 1}</th>
                  <td>{experience.animal.owner.name}</td>
                  <td>{experience.animal.owner.email}</td>
                  <td>{experience.animal.owner.contact}</td>
                  <td>{experience.disease.name}</td>
                  <td>{experience.animal.status}</td>
                  <td>
                    <img
                      width='10%'
                      height='50%'
                      src={editImage}
                      role='button'
                      color='dark'
                      name={i}
                      style={{ marginBottom: '2rem' }}
                      onClick={this.handleClick}
                    />
                    <Modal
                      isOpen={this.state.modal}
                      toggle={this.toggle}
                      data-id={i + 10}
                    >
                      <ModalHeader toggle={this.toggle}>
                        Update the status of the animal
                      </ModalHeader>
                      <ModalBody>
                        <Form>
                          <FormGroup>
                            <div
                              value={this.state.value}
                              onChange={this.onChange}
                            >
                              <div>
                                <input
                                  type='radio'
                                  value='Infected'
                                  name='optradio'
                                />{' '}
                                Infected
                              </div>
                              <div>
                                <input
                                  type='radio'
                                  value='Recovered'
                                  name='optradio'
                                />{' '}
                                Recovered
                              </div>
                              <div>
                                <input
                                  type='radio'
                                  value='Deceased'
                                  name='optradio'
                                />{' '}
                                Deceased
                              </div>
                            </div>

                            <Button
                              key={i}
                              onClick={this.handleButtonClicked}
                              color='dark'
                              style={{ marginTop: '2rem' }}
                              onClick={this.handleSubmit}
                              name={i}
                              block
                            >
                              Update
                            </Button>
                          </FormGroup>
                        </Form>
                      </ModalBody>
                    </Modal>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Animal_Case;
