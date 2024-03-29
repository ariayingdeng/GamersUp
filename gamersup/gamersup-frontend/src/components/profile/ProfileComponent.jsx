import { useContext, useState } from 'react';
import UserContext from '../../context/user/UserContext';
import AlertContext from '../../context/alert/AlertContext';
import axios from 'axios';
import UserBirthday from '../../components/profile/ProfileCard/UserBirthday';
import UserLevel from '../../components/profile/ProfileCard/UserLevel';
import UserLikes from '../../components/profile/ProfileCard/UserLikes';
import UserBio from '../../components/profile/ProfileCard/UserBio';
import gamerAvatar from '../../images/gamers-logo.png';

function ProfileComponent({ gamer, socket }) {
  const { id, name, email, dob, level, likes, bio, avatarUrl } = gamer;
  const { user, isFriend, addFriend } = useContext(UserContext);
  const { setAlertWithTimeout } = useContext(AlertContext);
  const [imageSelected, setImageSelected] = useState('');
  const { changeAvatar } = useContext(UserContext);
  const [imgUrl, setImgUrl] = useState(avatarUrl);
  const [friend, setFriend] = useState(
    isFriend(id, user.id).then((res) => {
      setFriend(res.data);
    })
  );

  const uploadAvatar = async () => {
    if (imageSelected === '') {
      setAlertWithTimeout('Please select an avatar!!', 'information');
    } else {
      const formData = new FormData();
      formData.append('file', imageSelected);
      formData.append('upload_preset', 'douglas_finalProject');

      axios
        .post(
          'https://api.cloudinary.com/v1_1/mydouglasproject/upload',
          formData
        )
        .then((response) => {
          changeAvatar(response.data.url);
          setImgUrl(response.data.url);
        })
        .catch((error) => {
          setAlertWithTimeout('The file is too huge!!', 'information');
        });
    }

    // await axios.post("https://api.cloudinary.com/v1_1/mydouglasproject/image/upload -X POST --data 'file=<FILE>&timestamp=<TIMESTAMP>&api_key=<API_KEY>&signature=<SIGNATURE>'",
    // {
    //     file: "file",
    //     timestamp: "",
    //     api_key: "",
    //     signature: ""
    // })
  };

  const askForFriend = async () => {
    socket?.emit('sendNotification', {
      senderId: user.id,
      receiverId: id,
      type: 2,
    });
    await addFriend(user.id, id);
  };

  return (
    <>
      {/* Avatar part */}
      <div className='grid grid-cols-[2fr_3fr] gap-4'>
        <div id='left'>
          <div className='justify-center flex'>
            <h1 className='text-neutral-content py-2 text-4xl shadow-inner shadow-black bg-base-100 px-4 rounded-[16px] mt-2'>
              {name}
            </h1>
          </div>
          <div className='avatar mt-4 justify-center mx-auto flex mb-6'>
            <div className='mb-2 w-64 h-64 mask mask-squircle '>
              {/* {avatarUrl === null && <img src={gamerAvatar} alt='avatar' />}
              {avatarUrl !== null && <img src={imgUrl} alt='Avatar' />} */}
              <img
                src={imgUrl !== null ? imgUrl : gamerAvatar}
                alt='avatar'
                onError={(e) => {
                  e.target.src = gamerAvatar;
                }}
              />
            </div>
          </div>
          {id === user.id && (
            <div className='justify-center flex mb-6'>
              <form className='flex items-center space-x-6'>
                <label className='block'>
                  <span className='sr-only'>Choose profile photo</span>
                  <input
                    type='file'
                    className='block w-full text-sm text-slate-500
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0
                 file:text-sm file:font-semibold
                 file:bg-violet-50 file:text-violet-700
                 hover:file:bg-violet-100'
                    onChange={(e) => {
                      setImageSelected(e.target.files[0]);
                    }}
                    accept='image/*'
                  />
                </label>
              </form>
              <button
                type='submit'
                className='rounded-full bg-primary px-10 '
                onClick={uploadAvatar}
              >
                Upload
              </button>
            </div>
          )}
          {/* {id !== user.id && friend && (
            <h1 className='px-auto text-center text-2xl'>Hello, {name}</h1>
          )} */}
          {id !== user.id && !friend && (
            <div className='flex justify-center'>
              <button
                className='rounded-full bg-primary px-6 py-2 flex justify-center hover:bg-primary-focus'
                onClick={askForFriend}
              >
                <span className='material-symbols-outlined mr-2'>
                  group_add
                </span>{' '}
                <strong>Add friend</strong>
              </button>
            </div>
          )}
        </div>
        {/* Detail Part */}
        <div id='right' className='bg-neutral px-10 pt-2 '>
          <div className='justify-center flex '>
            <h1 className='text-neutral-content py-2 text-4xl  px-4 rounded-[16px] mb-4'>
              Profile
            </h1>
          </div>
          <div id='detailInnerGrid' className='grid grid-cols-2 gap-4'>
            <div className='justify-center flex bg-base-200 rounded-[16px] p-2 grid grid-cols-1 gap-4 shadow-inner shadow-black'>
              <h2 className='inline-flex text-accent-focus py-1 text-xl'>
                Email:
              </h2>
              <h2 className='inline-flex text-neutral-content py-1 text-2xl'>
                &nbsp;{email}
              </h2>
            </div>
            <UserBirthday gamerId={id} dob={dob} />
            <UserLevel gamerId={id} level={level} />
            <UserLikes gamerId={id} likes={likes} socket={socket} />
            <UserBio gamerId={id} bio={bio} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileComponent;

// Redundant HTML
//
//  {/* <div className="justify-center flex bg-base-200 rounded-[16px] p-2 grid grid-cols-1 gap-4 shadow-inner shadow-black" id="userBirthday">
//             <h2 className="inline-flex text-accent-focus py-1 text-xl">
//               BirthDay:{" "}
//             </h2>{" "}
//             <h2 className="inline-flex text-neutral-content py-1 text-3xl">
//               &nbsp;&nbsp;{myDob}
//             </h2>
//     </div> */}

//
// {/* <div className="justify-center flex bg-base-200 rounded-[16px] p-2 grid grid-cols-1 gap-4 shadow-inner shadow-black">
//         <h2 className="inline-flex text-accent-focus py-1 text-xl">
//           Game Level:{" "}
//         </h2>{" "}
//         <h2 className="inline-flex text-neutral-content py-1 text-3xl">
//           &nbsp;&nbsp;{myLevel}
//         </h2>
//       </div> */}
//
// {/* <div className="justify-center flex bg-base-200 rounded-[16px] p-2 grid grid-cols-1 gap-4 shadow-inner shadow-black">
//             <h2 className="inline-flex text-accent-focus py-1 text-xl">
//               Likes :{" "}
//             </h2>
//             <div>
//               <h2 className="inline-flex text-neutral-content py-1 text-3xl">
//                 &nbsp;&nbsp;{myLikes}
//               </h2>
//               <button className="btn-ghost badge badge-outline text-xs hover:bg-primary-focus mx-4 my-auto p-3">
//                 <FiThumbsUp className="inline mr-1 w-5 py-auto mx-2" />
//               </button>
//             </div>
//           </div> */}
//
//  {/* <div id="bio" className="col-span-2 grid grid-cols-1 bg-base-200 rounded-[16px] shadow-inner shadow-black p-2" >
//             {" "}
//             <h2 className="inline-flex text-accent-focus py-1 text-xl">
//               Bio:{" "}
//               <button className="btn-ghost badge badge-outline text-xs mx-4 my-auto p-3 absolute right-12" onClick={bioBlockChange}>
//                <FaPencilAlt/>
//               </button>
//             </h2>{" "}
//             { !typingBio && (
//                      <h2 className="inline-flex text-neutral-content py-1 text-2xl">
//               {myBio}
//             </h2>
//             )}
//             { typingBio && (
//               <form onSubmit={uploadBio}>
//                 <textarea  className="inline-flex text-neutral-content py-1 text-2xl text-black" id="bioBlock" defaultValue={myBio}/>
//                 <button type="submit"
//                  className='group align-middle float-right relative w-20 justify-center px-10 border border-transparent h-6 min-h-6 text-sm rounded-full btn btn-primary focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus'>
//                   Submit</button>
//               </form>
//             )}

//           </div> */}
