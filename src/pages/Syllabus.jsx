/**
 * @file Syllabus.jsx
 * @description Displays the curriculum for various subjects.
 * Uses an accordion-style UI to expand/collapse topics and provides links to external study materials.
 */

import React, { useState } from 'react';

/**
 * Syllabus Component
 * @returns {JSX.Element} The interactive syllabus page
 */
const Syllabus = () => {
  // State to track which subject's accordion is currently expanded (null if all closed)
  const [expandedSubject, setExpandedSubject] = useState(null);

  // Hardcoded syllabus data containing subjects, topics, and resource links
  const subjects = [
    {
      id: 1,
      code: "CS301",
      name: "Database Management Systems",
      topics: [
        { 
          title: "Introduction to DBMS", 
          material: "https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/",
          description: "Basics of databases, data models, and schemas."
        },
        { 
          title: "ER Modeling", 
          material: "https://www.javatpoint.com/dbms-er-model-concept",
          description: "Entity-Relationship diagrams, entities, attributes, and relationships."
        },
        { 
          title: "SQL Queries", 
          material: "https://sqlbolt.com/",
          description: "DDL, DML, DCL commands and complex joins."
        },
        { 
          title: "Normalization", 
          material: "https://www.guru99.com/database-normalization.html",
          description: "1NF, 2NF, 3NF, and BCNF concepts."
        }
      ]
    },
    {
      id: 2,
      code: "CS302",
      name: "Operating Systems",
      topics: [
        { 
          title: "Process Management", 
          material: "https://www.tutorialspoint.com/operating_system/os_processes.htm",
          description: "Process states, PCB, and context switching."
        },
        { 
          title: "CPU Scheduling", 
          material: "https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/",
          description: "FCFS, SJF, Priority, and Round Robin algorithms."
        },
        { 
          title: "Memory Management", 
          material: "https://www.javatpoint.com/os-memory-management-introduction",
          description: "Paging, segmentation, and virtual memory."
        }
      ]
    },
    {
      id: 3,
      code: "PY101",
      name: "Python Programming",
      topics: [
        { 
          title: "Python Basics", 
          material: "https://docs.python.org/3/tutorial/introduction.html",
          description: "Syntax, variables, data types, and operators."
        },
        { 
          title: "Control Flow", 
          material: "https://www.w3schools.com/python/python_conditions.asp",
          description: "If-else, loops (for, while), and list comprehensions."
        },
        { 
          title: "Functions & Modules", 
          material: "https://realpython.com/defining-your-own-python-function/",
          description: "Defining functions, arguments, and importing modules."
        }
      ]
    },
    {
      id: 4,
      code: "DB201",
      name: "SQL & Relational Databases",
      topics: [
        { 
          title: "SQL Select", 
          material: "https://sqlbolt.com/lesson/select_queries_introduction",
          description: "Selecting data, filtering, and sorting results."
        },
        { 
          title: "Joins", 
          material: "https://www.w3schools.com/sql/sql_join.asp",
          description: "Inner, Left, Right, and Full Outer joins."
        },
        { 
          title: "Aggregations", 
          material: "https://www.geeksforgeeks.org/aggregate-functions-in-sql/",
          description: "Count, sum, avg, min, max, and group by."
        }
      ]
    },
    {
      id: 5,
      code: "MA101",
      name: "Engineering Mathematics",
      topics: [
        { 
          title: "Linear Algebra", 
          material: "https://www.khanacademy.org/math/linear-algebra",
          description: "Matrices, determinants, and systems of linear equations."
        },
        { 
          title: "Calculus", 
          material: "https://tutorial.math.lamar.edu/classes/calci/calci.aspx",
          description: "Differentiation, integration, and their applications."
        },
        { 
          title: "Differential Equations", 
          material: "https://www.geeksforgeeks.org/differential-equations/",
          description: "First-order and higher-order differential equations."
        }
      ]
    },
    {
      id: 6,
      code: "PH101",
      name: "Engineering Physics",
      topics: [
        { 
          title: "Quantum Mechanics", 
          material: "https://physics.info/quantum-mechanics/",
          description: "Wave-particle duality, Schrodinger equation."
        },
        { 
          title: "Optics", 
          material: "https://www.tutorialspoint.com/engineering_physics/engineering_physics_optics.htm",
          description: "Interference, diffraction, and polarization."
        },
        { 
          title: "Lasers", 
          material: "https://www.britannica.com/technology/laser",
          description: "Principles of laser action and types of lasers."
        }
      ]
    },
    {
      id: 7,
      code: "WD101",
      name: "HTML & CSS",
      topics: [
        { 
          title: "HTML5 Semantic Tags", 
          material: "https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html",
          description: "Using header, footer, section, and article correctly."
        },
        { 
          title: "CSS Flexbox", 
          material: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
          description: "Layout alignment and distribution using Flexbox."
        },
        { 
          title: "Responsive Design", 
          material: "https://www.w3schools.com/css/css_rwd_intro.asp",
          description: "Media queries and fluid layouts."
        }
      ]
    },
    {
      id: 8,
      code: "WD102",
      name: "JavaScript",
      topics: [
        { 
          title: "ES6+ Features", 
          material: "https://javascript.info/es-modern",
          description: "Arrow functions, destructuring, and spread operator."
        },
        { 
          title: "Asynchronous JS", 
          material: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous",
          description: "Promises, async/await, and Fetch API."
        },
        { 
          title: "DOM Manipulation", 
          material: "https://www.javascripttutorial.net/javascript-dom/",
          description: "Selecting and modifying elements on the fly."
        }
      ]
    },
    {
      id: 9,
      code: "WD201",
      name: "ReactJS",
      topics: [
        { 
          title: "Components & Props", 
          material: "https://react.dev/learn/your-first-component",
          description: "Functional components and passing data."
        },
        { 
          title: "Hooks (useState, useEffect)", 
          material: "https://react.dev/reference/react/hooks",
          description: "State management and side effects."
        },
        { 
          title: "State Management (Context)", 
          material: "https://react.dev/learn/passing-data-deeply-with-context",
          description: "Avoiding prop drilling using Context API."
        }
      ]
    }
  ];

  /**
   * Toggles the accordion state for a specific subject.
   * If the clicked subject is already open, it closes it (sets state to null).
   * Otherwise, it opens the clicked subject.
   * @param {number} id - The unique ID of the subject
   */
  const toggleSubject = (id) => {
    setExpandedSubject(expandedSubject === id ? null : id);
  };

  return (
    <div className="syllabus-page">
      <div className="page-header">
        <h1 className="page-title gradient-text">Subject Syllabus</h1>
        <p className="page-subtitle">View topics and access reading materials for your courses</p>
      </div>

      <div className="syllabus-list mt-6">
        {/* Render an accordion item for each subject */}
        {subjects.map((subject) => (
          <div key={subject.id} className="glass-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '1rem' }}>
            {/* Accordion Header (Clickable to toggle) */}
            <div 
              className={`syllabus-subject-header ${expandedSubject === subject.id ? 'active' : ''}`}
              onClick={() => toggleSubject(subject.id)}
            >
              <div>
                <span className="text-sm font-bold" style={{ color: 'var(--primary)', marginRight: '0.75rem' }}>{subject.code}</span>
                <span className="text-lg font-medium">{subject.name}</span>
              </div>
              {/* Dropdown Indicator Icon (rotates when expanded) */}
              <div style={{ transform: expandedSubject === subject.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                ▼
              </div>
            </div>

            {/* Accordion Body (Only renders if this subject is the currently expanded one) */}
            {expandedSubject === subject.id && (
              <div className="subject-content" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="topic-grid">
                  {/* Map through and render individual topics within the subject */}
                  {subject.topics.map((topic, idx) => (
                    <div key={idx} className="topic-card">
                      <div className="topic-header">
                        <h3 className="topic-title">{topic.title}</h3>
                        {/* External link to study material */}
                        <a 
                          href={topic.material} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-primary"
                          style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                        >
                          Read
                        </a>
                      </div>
                      <p className="topic-description">{topic.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Syllabus;
