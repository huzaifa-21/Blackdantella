import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const Users = () => {
  const [users, setUsers] = useState([
    {
      address: {},
      cartdata: [],
      email: ";laksjdfsjdf",
      name: "Sahar ALi",
      role: "admin",
      _id: "67212c14ec42d429f2c96622",
    },
  ]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await axiosInstance(`/api/users`);
      const data = response.data.data;
      setUsers(data);
    };
    getUsers();
  }, []);

  if (!users || users.length <= 1) return <div className="spinner">...loading</div>;

  return (
    <div>
      {users.map((user) => {
        return (
          <div className="user-box" key={user._id}>
            <span className="user-name">{user.name}</span>
          </div>
        );
      })}
    </div>
  );
};
export default Users;
