"use client";
import ButtonPrimary from "@/shared/ButtonPrimary";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
export interface ProfileProps {}

interface UserData {
  _id: string;
  email: string;
  isVerified: boolean;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day} ${month} ${time}`;
};

const ProfilePage: FC<ProfileProps> = ({}) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [logout, setLogout] = useState(false);
  const router = useRouter();

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/user/profile");
      console.log(response.data);
      setUserData(response.data.data); // Store the full user data object
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("/api/user/logout");
      setLogout(true);
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <>
      <div>
        <h1 className="text-3xl font-semibold  p-2">Profile Page</h1>
      </div>
      <div>
        <h2>
          {userData ? (
            <p className="text-2xl">
              <span className="text-primary-6000 pl-2">{userData.name}'s</span>
              Details
            </p>
          ) : (
            <div className="h-[40vh] flex items-center text-3xl  justify-center">
              Fetching the details...
              <CgSpinner className="animate-spin text-2xl" />
            </div>
          )}
        </h2>
        {userData && (
          <div className="flex justify-center">
            <div className="w-40 h-40 border-red-400 border-2 rounded-full">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD116U9ZCk8bEaanCeB5rSCC2uqY5Ka_2_EA&s"
                className="w-40 h-40 rounded-full overflow-hidden"
                alt="user"
              />
            </div>
            <div>
              <div className="mt-4 font-semibold ml-10">
                <p>
                  <strong>Name:</strong> {userData.name}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>

                <p>
                  <strong>Role:</strong> {userData.role}
                </p>
                <p>
                  <strong>Verified:</strong>{" "}
                  {userData.isVerified ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Created At:</strong> {formatDate(userData.createdAt)}
                </p>
                <p>
                  <strong>Updated At:</strong> {formatDate(userData.updatedAt)}
                </p>
                <ButtonPrimary className="mt-10 mb-10" onClick={handleLogout}>
                  Logout
                </ButtonPrimary>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
