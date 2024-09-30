import React, { useState, useEffect } from 'react';
import { BsXLg } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const Home = () => {
    const [students, setStudents] = useState([]);
    const [editStudent, setEditStudent] = useState(null);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', dob: '' });
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);


    useEffect(() => {
        axios.get("http://localhost:5001/users")
            .then((response) => {
                setStudents(response.data);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // Formats to DD/MM/YYYY
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5001/delete/${id}`)
            .then(response => {
                setStudents(students.filter(student => student.id !== id));
                console.log(response.data.message);
            })
            .catch(error => {
                console.error("There was an error deleting the student!", error);
            });
    };

    const handleEdit = (student) => {
        const dobFormatted = student.dob ? dayjs(student.dob).format('YYYY-MM-DD') : '';

        setEditStudent(student);
        setFormData({
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            dob: dobFormatted,
        });
    };


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const updatedFormData = {
            ...formData,
            dob: new Date(formData.dob).toISOString(), // Convert to ISO string
        };

        try {
            await axios.put(`http://localhost:5001/update/${editStudent.id}`, updatedFormData);

            setStudents(students.map(student =>
                student.id === editStudent.id ? { ...student, ...updatedFormData } : student
            ));

            setEditStudent(null);

            console.log('Updated student with data:', updatedFormData);
        } catch (error) {
            console.error("There was an error updating the student!", error);
        }
    };

    const handleMenuToggle = () => {
        setShowMenu(!showMenu);
    };

    const handleRegistration = () => {
        navigate('/registration-form');
    };

    const handleHome = () => {
        navigate('/');
    };

    return (
        <div className='min-h-screen bg-gray-100 relative'>
            <div className='text-lg font-bold text-center p-10 flex justify-end pr-10'>
                <button
                    onClick={handleMenuToggle}
                    className='border border-black rounded-2xl text-white bg-black px-6 py-2 hover:text-black hover:bg-white transition-all duration-300'>
                    Student Registration
                </button>
            </div>

            {showMenu && (
                <div className='fixed top-0 right-0 w-1/3 h-full bg-black text-white transition-all duration-300 z-10'>
                    <div className='flex justify-end p-5'>
                        <button onClick={handleMenuToggle}>
                            <BsXLg size={24} />
                        </button>
                    </div>
                    <div className='text-lg sm:text-xl text-center px-4 py-10 flex flex-col gap-5 hover:cursor-pointer'>
                        <div onClick={handleHome}>Home</div>
                        <div onClick={handleRegistration}>Registration Form</div>
                    </div>
                </div>
            )}

            <div className='text-center p-6 mx-auto max-w-4xl'>
                <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold'>Welcome to Student Registration!</h1>
                <p className='text-lg sm:text-xl md:text-2xl font-semibold pt-5'>
                    Register now to join our vibrant learning community
                </p>
                <button
                    onClick={handleRegistration}
                    className='border-2 border-black p-2 mt-5 bg-green-600 rounded-md text-lg sm:text-xl font-bold hover:text-white transition-all duration-300'>
                    Get Started
                </button>
            </div>

            <div>
                <h2 className='text-3xl font-bold text-center pt-10'>Registered Student Details</h2>
                <div className='flex flex-col pt-5 text-xl'>
                    {students.length > 0 ? (
                        students.map((student) => (
                            <div key={student.id} className="mx-32 pt-5">
                                <table className="w-full text-xl text-left">
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="py-2">{student.firstName} {student.lastName}</td>
                                            <td className="py-2">{student.email}</td>
                                            <td className="py-2">{formatDate(student.dob)}</td> {/* Format the date */}
                                            <td className="py-2">
                                                <button
                                                    className="border-2 border-black px-6 font-bold bg-green-600 rounded-2xl"
                                                    onClick={() => handleEdit(student)}>
                                                    EDIT
                                                </button>
                                            </td>
                                            <td className="py-2">
                                                <button
                                                    className="border-2 border-black px-6 font-bold bg-red-600 rounded-2xl hover:bg-white"
                                                    onClick={() => handleDelete(student.id)}>
                                                    DELETE
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No students registered yet.</p>
                    )}
                </div>
            </div>

            {editStudent && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white p-4 md:p-8 rounded-lg w-11/12 md:w-1/2">
                        <h3 className="text-xl md:text-2xl font-bold mb-5">Edit Student</h3>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block font-bold mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="border rounded w-full py-2 px-3"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="border rounded w-full py-2 px-3"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="border rounded w-full py-2 px-3"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold mb-2">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob ? formData.dob : ''} // Correctly formatted date
                                    onChange={handleInputChange}
                                    className="border rounded w-full py-2 px-3"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditStudent(null)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;
