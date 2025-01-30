import React, { useEffect, useState } from 'react';
import UseFetchMe from '../hooks/UseFechMe';
import useupdateDonor from '../hooks/UseUpdateDonor';

export default function Profile() {
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    bloodType: '',
    contact: '',
    
  });
  const { data: user, isLoading: userLoading } = UseFetchMe();
  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user?.data[0]?.name,
        age: user?.data[0]?.age,
        email: user?.data[0].Auth?.email,
        contact: user?.data[0]?.phone,
        gender: user?.data[0]?.gender,
        bloodType: user?.data[0]?.bloodGroup,
        
      })
    }
  }, [user?.data]);



  // Handle change for input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const {mutate}=useupdateDonor({
onSuccess:(data)=>{
console.log('Profile updated:',data)
},
onError:(error)=>{
console.log('Profile update failed:',error)

}

  })

  // Handle save action
  const handleSave = () => {
    mutate(userProfile)
  };

  return (
    <div className="container mx-auto my-6 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center">Editable Profile Information</h1>
        <hr className="my-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={userProfile.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold">Age</label>
            <input
              type="number"
              name="age"
              value={userProfile.age}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold">Gender</label>
            <input
              type="text"
              name="gender"
              value={userProfile.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={userProfile.email}
              disabled
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold">Blood Type</label>
            <input
              type="text"
              name="bloodType"
              value={userProfile.bloodType}
              disabled
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold">Contact Info</label>
            <input
              type="text"
              name="contact"
              value={userProfile.contact}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-400"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
