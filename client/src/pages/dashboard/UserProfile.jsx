import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { useForm } from "react-hook-form";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UserProfile = () => {
  const { updateUserProfile } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [photoURL, setPhotoURL] = useState("");

  const onSubmit = async (data) => {
    const name = data.name;

    try {
      if (data.photoURL[0]) {
        // Upload file to Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, `profile_photos/${data.photoURL[0].name}`);
        await uploadBytes(storageRef, data.photoURL[0]);

        // Get the download URL
        const url = await getDownloadURL(storageRef);
        setPhotoURL(url); // Update the state with the URL
      }

      // Update user profile with name and photoURL
      await updateUserProfile(name, photoURL);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <div className="h-screen max-w-md mx-auto flex items-center justify-center ">
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Your name"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Upload Photo</span>
            </label>
            <input
              type="file"
              {...register("photoURL")}
              className="file-input w-full mt-1"
            />
            {/* <input type="text" {...register("photoURL")} placeholder="photo url" className="input input-bordered" required /> */}
          </div>
          <div className="form-control mt-6">
            <input
              type="submit"
              value={"Update"}
              className="btn bg-green text-white"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
