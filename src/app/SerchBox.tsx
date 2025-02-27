"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoSearchOutline } from "react-icons/io5";

interface User {
  id: number;
  login: string;
  avatar_url: string;
  name?: string;
  location?: string;
  bio?: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  created_at: string;
}

const UserCard = ({ selectedUser, onClose }: { selectedUser: User; onClose: () => void }) => {
  return (
    <div className="top-60 left-[41%] max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden absolute">
      <div className="bg-gray-800 p-4">
        <h2 className="text-white text-xl font-semibold">{selectedUser.name || selectedUser.login}</h2>
        <p className="text-gray-400">@{selectedUser.login}</p>
      </div>

      <div className="p-4 bg-slate-300">
        <p className="text-gray-600 text-sm">
          Joined {new Date(selectedUser.created_at).toLocaleDateString()}
        </p>

        <p className="text-gray-700 mt-2">{selectedUser.bio || 'No bio available'}</p>

        <div className="flex justify-between mt-4">
          <div>
            <p className="text-gray-600 text-sm">Repos</p>
            <p className="text-gray-800 font-semibold">{selectedUser.public_repos}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Followers</p>
            <p className="text-gray-800 font-semibold">{selectedUser.followers}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Following</p>
            <p className="text-gray-800 font-semibold">{selectedUser.following}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-600 text-sm">📍 {selectedUser.location || 'No location provided'}</p>
          <a
            href={selectedUser.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            {selectedUser.html_url}
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get<User[]>('https://api.github.com/users');
        setUsers(response.data);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const filteredUsers = users.filter(user =>
      user.login.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredUsers);
  }, [searchTerm, users]);

  const fetchUserDetails = async (username: string) => {
    setLoading(true);
    try {
      const response = await axios.get<User>(`https://api.github.com/users/${username}`);
      setSelectedUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseUserCard = () => {
    setSelectedUser(null);
  };

  return (
    <div className="">
      <div className='flex items-center flex-col bg-white shadow-lg rounded-lg overflow-hidden min-w-96 p-3'>
        <div className='flex items-center'>
          <IoSearchOutline className='text-blue-400 text-3xl font-bold' />
          <input
            type="text"
            placeholder="Search username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded border-none text-neutral-500 focus:outline-none"
          />
          <button
            className='bg-blue-800 rounded-xl p-3 pr-5 pl-5 ml-32 relative -left-1.25 text-white'
          >
            Search
          </button>
        </div>

        <div className="mt-4 w-full">
          {loading && <p className="text-gray-600">Loading...</p>}

          <div className="overflow-y-auto max-h-96">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {searchResults.map(user => (
                <div
                  key={user.id}
                  onClick={() => fetchUserDetails(user.login)}
                  className="cursor-pointer bg-slate-300 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img src={user.avatar_url} alt={user.login} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-black">{user.login}</h2>
                    <p className="text-gray-800 text-sm text-center">{user.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedUser && (
        <UserCard selectedUser={selectedUser} onClose={handleCloseUserCard} />
      )}
    </div>
  );
}
