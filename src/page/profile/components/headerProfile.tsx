import {useContext, useEffect, useState} from "react";
import { UsergroupAddOutlined, TrophyOutlined,
     LinkOutlined, UserAddOutlined,
     EditOutlined,
     UserOutlined,
     ShareAltOutlined,
    } from "@ant-design/icons";
import { Button, message, } from "antd";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ProfileContext } from "../profile";
import { UserContext } from "../../../auth/ProtectedRoute";
import { useMutation, useQuery } from "react-query";
import { countTotalFriend, makeFriend } from "../../../api/user";
import { HeaderProfileLoader } from "../../../components/loader/heardProfileLoader";
import { FriendButton } from "./friendButton";




const HeaderProfile:React.FC = () => {

const { data:profile } = useContext(ProfileContext)
const currentUser:any = useContext(UserContext)
const [change ,setChange] = useState<boolean>(false)
const [messageApi, contextHolder] = message.useMessage()
const navigate = useNavigate()


const {data:count ,isLoading:loading} = useQuery(
    ['friendCount', profile?.userid ,currentUser?.userid ],
   ()=>countTotalFriend({
    userid1 : profile?.userid,
    currentUser: currentUser?.userid
   }),
    {
        enabled : profile?.userid ? true : false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        keepPreviousData : true,
    })





const handleNavigate = (type:string) => {
    localStorage.setItem('friend', profile?.userid)
    if(type === "follower"){
        navigate('/f/follower')  
    }else if(type == "following"){
        navigate('/f/following')
    }
}

useEffect(()=> {
    if(window.location.pathname !== `/f`){
        localStorage.removeItem('friend')
    }
},[profile])

    return<> <div className="flex-col 
      w-full md:py-5 ">
        {contextHolder}
        {
            loading ? <HeaderProfileLoader/> :
    <div className="flex gap-5 w-full text-[20px] text-center">
    <button onClick={()=>handleNavigate("follower")}  className="">
   <h4 className=" font-sans font-semibold">{count?.result?.follower}</h4>
   <div className="flex items-center">
   <UsergroupAddOutlined
   className="text-[14px] px-2"/>
   <p className="text-zinc-400 
    text-[12px] truncate">follower</p>
   </div>
   </button>
        
   <button 
   onClick={()=>handleNavigate("following")} 
   className=" ">
   <h1 className=" 
   font-sans font-semibold">{count?.result?.following} </h1>
   <div className="flex 
   items-center">
   <LinkOutlined
   className=" text-[14px] px-2"/>
   <p className="text-zinc-400  
    text-[12px] truncate">following</p>
   </div>
   </button>

   <div className="text-center">
   <h1 className=" font-sans font-semibold ">{ 
    count?.result?.achivments }</h1>
   <div className="flex items-center">
   <TrophyOutlined
   className="text-[14px] md:px-2"/>
   <p className="text-zinc-400  
    text-[12px] truncate">achivment</p>
   </div>
   </div>
    </div>
}

    <FriendButton isFriend ={count?.checkFriend} isFollower={count?.checkFollower} 
    isFollowing={count?.checkFollowing}/>
    </div>
    </>
}

export default HeaderProfile