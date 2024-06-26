import { CloseOutlined, UserOutlined, LoadingOutlined, SearchOutlined, MessageOutlined } from "@ant-design/icons"
import React, { useState, useEffect } from "react";
import { Modal,Form, Input, Button } from "antd";
import { useMutation } from "react-query";
import { userSearch } from "../api/user";
import { AvatarUser } from "./Avatar";
import { Link } from "react-router-dom";



interface Search  {
  target_url ? : string,
}


export const SearchBtn:React.FC<Search> = ({target_url = '#'}) =>{   
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message ,setMessages] = useState<string>('')
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const {isLoading, mutate, data} = useMutation(userSearch , {
    onSuccess : (data:any) => {
      if(!data.success) {
        setMessages(data.message)
      }
    },
    onError:(error)=>{
      alert(`error something `)
    }
  })

  const handleSearch = async (value:any) => {
    try {
      await mutate(value)
    } catch (error) {
      alert(error)
    }
  }

    return <>
           <button onClick={showModal} type="submit" >
           <SearchOutlined/>
           </button>
          
<Modal title="Search" open={isModalOpen

} onOk={handleOk} footer onCancel={handleCancel}>
       <Form 
       onFinish={handleSearch}
       className=" flex gap-2  w-full">
        <Form.Item name="username" className="w-full">
          <Input className="w-full"
           placeholder="search something people"/>
        </Form.Item>
        <Form.Item>
          <Button
          htmlType="submit"
          icon={<SearchOutlined/>}
          />
        </Form.Item>
       </Form>

       <div>
        {message && <p>{message}</p>}
        {isLoading ? <LoadingOutlined></LoadingOutlined> : null}
        <ul>
          {data?.result?.map((user:any,)=> <li className="my-3 flex gap-2 items-center 
          justify-between" key={user?.userid}>
            <div className="flex gap-4 items-center">
            <AvatarUser src={user?.userInfoInstance?.profile_url}/>
            <p className="text-zinc-700 dark:text-neutral-100">{user?.username}</p>
          </div>
          <div className="flex gap-2">
          <Link to={`/p/${user?.username}/feed`}>
            <UserOutlined/>
            </Link>
            <Link to={`/chat/p/${user?.userid}`}>
            <MessageOutlined/>  
            </Link>
            </div>
          </li>)}
        </ul>
       </div>
      </Modal>
</>
}