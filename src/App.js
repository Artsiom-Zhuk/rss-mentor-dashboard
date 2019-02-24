import React, { Component } from 'react';
import './App.css';
import Select from 'react-select';


class App extends React.Component {
  state = {
    selectedMenors: JSON.parse(localStorage.getItem('selectedMentor')),
    data: [],
    mentors: []
  }

  componentDidMount() {
    fetch(process.env.PUBLIC_URL + '/data.json')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const mentors = data.map(mentor => {
          return ({
            label: mentor.fullName,
            github: mentor.github,
            students: mentor.students
          })
        })
        this.setState({ data, mentors });
      })
      .catch(alert);
  };

  handleChange = (selectedMenors) => {
    this.setState({ selectedMenors });
    localStorage.setItem('selectedMentor', JSON.stringify(selectedMenors));
  }

  getClassName = (state) => {
    switch (state) {
      case 'Checked': {
        return 'greenColor'
      }

      case 'notDone': {
        return 'redColor'
      }

      case 'ToDo': {
        return 'grayColor'
      }

      case 'In Progress': {
        return 'yellowColor'
      }

      case 'Checking': {
        return 'pinkColor'
      }
    }
  }

  render() {
    const { selectedMenors, mentors } = this.state;

    const students = selectedMenors && selectedMenors.students.map(student => {
      return (
        <td className='app__td-student-github' key={student.github}>{student.github}</td>
      )
    })

    const stateTasks = selectedMenors && selectedMenors.students.map(student => {
      return (
        <td key={student.github}>
          {student.tasks.map((task, index )=> {
            return <tr className='app_tr-task-state' key={index}>
              <td className={this.getClassName(task.state)}>{task.state}</td>
            </tr>
          })}
        </td>
      )
    })

    const tasks = selectedMenors && selectedMenors.students[0].tasks.map((task, index) => {
      return (
        <tr key={index}>
          <td>{task.name}</td>
        </tr>
      )
    })

    return (
      <div>
        <div className='app__div-select-mentor'>
          <div style={{ fontSize: 20 }}>
            Mentor
          </div>
          <div>
            <Select className="app__select"
              value={selectedMenors}
              onChange={this.handleChange}
              options={mentors}
            />
          </div>
        </div>

        {selectedMenors && (
          <table className='app__table'>
            <thead >
              <tr >
                <td></td>
                {students}
              </tr>
            </thead>
            <tbody>
              <tr>
                {tasks}
                {stateTasks}
              </tr>
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
export default App;