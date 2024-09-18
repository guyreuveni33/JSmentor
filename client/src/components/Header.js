import React from 'react';
import './Header.css';

const Header = ({ role, studentsCount }) => (
    <div className="header">
        <h1 className="title">{role === 'mentor' ? 'Mentor Dashboard' : 'Student Workspace'}</h1>
        <div className="active_students">Active students: {studentsCount}</div>
    </div>
);

export default Header;
