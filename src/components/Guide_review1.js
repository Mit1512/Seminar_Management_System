import React, { useState, useEffect } from 'react';

function GuideReview() {
  // State to manage topics, pairs, selected topics, and email addresses
  const [topics, setTopics] = useState([]);// Stores topics
  const [pairs, setPairs] = useState([]);// Stores pairs of guide and student emails
  // const [guideEmail, setGuideEmail] = useState(null);
  const [studentEmail, setStudentEmail] = useState(null);


  // Fetch pairs of guide and student emails from the server on component mount
  useEffect(() => {
    fetch('http://localhost:5000/get-pair')
      .then(response => response.json())
      .then(data => setPairs(data))
      .catch(error => console.error(error));
  }, []);

  // Effect to extract student's email from pairs and update the state
  useEffect(() => {
    const guideEmails = pairs.map(pair => pair.guide_email);
    // const [guideEmail] = guideEmails;
    // setGuideEmail(guideEmail);

    const studentEmails = pairs.map(pair => pair.student_email);
    const [studentEmail] = studentEmails;
    setStudentEmail(studentEmail);
  }, [pairs]);

  // Fetch topics based on guide and student emails from the server
  const guideEmail = localStorage.getItem('guideEmail')
  useEffect(() => {
    fetch('http://localhost:5000/gettopics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ studentEmail:studentEmail, guideEmail :guideEmail })
    })
      .then(response => response.json())
      .then(data => setTopics(data))
      .catch(error => console.error(error));
  }, [guideEmail, studentEmail]);

  // State to manage selected topics for each student
  const [selectedTopics, setSelectedTopics] = useState({});

  const handleTopicSubmit = (event) => {
    event.preventDefault();
  }

  const handleTopicSubmit2 = (event, topic1, topic2, topic3) => {
    event.preventDefault();
    const selectedTopic = prompt(`Select a topic for ${studentEmail}`, `${topic1}, ${topic2}, ${topic3}`);
    const marks = prompt(`Enter marks for ${studentEmail} (${selectedTopic}):`);
    var topic = selectedTopic;
    console.log(topic)
    // POST request
    fetch('http://localhost:5000/result_1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email:studentEmail,
        topic,
        marks
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Response:', data);
        alert(`Successfully added marks for ${studentEmail} (${selectedTopic}): ${marks}`);
      })
      .catch(error => {
        console.error('Error:', error);
        alert(`Failed to add marks for ${studentEmail} (${selectedTopic}): ${marks}`);
      });

    // Update selectedTopics state
    setSelectedTopics(prevState => ({
      ...prevState,
      [studentEmail]: selectedTopic
    }));
  }

  // Render the component
  return (
    <div className="container">
      <h1>Guide Review 1 ({guideEmail})</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Topic 1</th>
            <th>Topic 2</th>
            <th>Topic 3</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {topics.map(topic => (
            <tr key={topic.id}>
              <td>{studentEmail}</td>
              <td className={selectedTopics[studentEmail]?.topic === topic.topic1 ? 'selected' : ''}>{topic.topic1}</td>
              <td className={selectedTopics[studentEmail]?.topic === topic.topic2 ? 'selected' : ''}>{topic.topic2}</td>
              <td className={selectedTopics[studentEmail]?.topic === topic.topic3 ? 'selected' : ''}>{topic.topic3}</td>
              <td>
                <form onSubmit={handleTopicSubmit}>
                  <input type="hidden" name="email" value={studentEmail} />
                  <input type="hidden" name="topic1" value={topic.topic1} />
                  <input type="hidden" name="topic2" value={topic.topic2} />
                  <input type="hidden" name="topic3" value={topic.topic3} />
                  <button type="submit" onClick={(e) => handleTopicSubmit2(e,  topic.topic1, topic.topic2, topic.topic3)} className="btn btn-primary">Select</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GuideReview;