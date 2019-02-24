const xlsx = require('node-xlsx').default;
const fs = require('fs');

const workSheetsFromTasks = xlsx.parse('./data/Tasks.xlsx');
const workSheetsFromMentorScore = xlsx.parse('./data/Mentor score.xlsx');
const workSheetsFromMentorStudentsPairs = xlsx.parse('./data/Mentor-students pairs.xlsx');

const mentors = [];
for (let i = 1; i < workSheetsFromMentorStudentsPairs[1].data.length; i++) {
    if (typeof workSheetsFromMentorStudentsPairs[1].data[i][0] === 'undefined' ||
        typeof workSheetsFromMentorStudentsPairs[1].data[i][1] === 'undefined' ||
        typeof workSheetsFromMentorStudentsPairs[1].data[i][2] === 'undefined' ||
        typeof workSheetsFromMentorStudentsPairs[1].data[i][4] === 'undefined') continue;
    mentors.push({
        firstname: workSheetsFromMentorStudentsPairs[1].data[i][0],
        surname: workSheetsFromMentorStudentsPairs[1].data[i][1],
        fullName: workSheetsFromMentorStudentsPairs[1].data[i][0] + ' ' + workSheetsFromMentorStudentsPairs[1].data[i][1],
        city: workSheetsFromMentorStudentsPairs[1].data[i][2],
        github: workSheetsFromMentorStudentsPairs[1].data[i][4]
    });
};

for (let i = 0; i < mentors.length; i++) {
    mentors[i].students = [];
    for (let j = 1; j < workSheetsFromMentorStudentsPairs[0].data.length; j++) {
        if (workSheetsFromMentorStudentsPairs[0].data[j][0] === mentors[i].fullName) {
            mentors[i].students.push({ github: workSheetsFromMentorStudentsPairs[0].data[j][1] });
        };
    };
};

for (let i = 0; i < mentors.length; i++) {
    for (let j = 0; j < mentors[i].students.length; j++) {
        mentors[i].students[j].tasks = [];
    }
}

const tasks = [];
for (let q = 1; q < workSheetsFromTasks[0].data.length; q++) {
    tasks.push({
        name: workSheetsFromTasks[0].data[q][0],
        state: workSheetsFromTasks[0].data[q][2]
    })
}

const score = [];
for (let i = 1; i < workSheetsFromMentorScore[0].data.length; i++) {
    score.push({
        githubStudents: workSheetsFromMentorScore[0].data[i][2],
        task: workSheetsFromMentorScore[0].data[i][3],
        result: workSheetsFromMentorScore[0].data[i][5]
    })
}

for (let i = 0; i < tasks.length; i++) {
    for (let j = 0; j < mentors.length; j++) {
        for (let p = 0; p < mentors[j].students.length; p++) {
            for (let k = 0; k < score.length; k++) {
                if (('https://github.com/' + mentors[j].students[p].github).toLowerCase() === score[k].githubStudents.toLowerCase() &&
                    tasks[i].name.trim().toLowerCase() === score[k].task.trim().toLowerCase()) {
                    switch (score[k].result) {
                        case 0: {
                            mentors[j].students[p].tasks.push({
                                name: tasks[i].name,
                                state: 'notDone'
                            });
                            break;
                        }

                        default: {
                            mentors[j].students[p].tasks.push({
                                name: tasks[i].name,
                                state: 'Checked'
                            });
                        }
                    }
                    break;
                }

                if (k === score.length - 1) {
                    if (tasks[i].state.toLowerCase() == 'checked') {
                        mentors[j].students[p].tasks.push({
                            name: tasks[i].name,
                            state: 'notDone'
                        });
                    } else {
                        mentors[j].students[p].tasks.push({
                            name: tasks[i].name,
                            state: tasks[i].state
                        });
                    };
                    break;
                }
            }
        }
    }
}


var data = JSON.stringify(mentors); 

fs.writeFile("./public/data.json", data, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});

// console.log(mentors[0].students[1]);

