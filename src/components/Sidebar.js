import { ListGroup ,Row, Col,Button} from 'react-bootstrap'
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { AppContext } from '../context/AppContext';
import {addNotifications, resetNotifications } from '../features/userSlice';
import { useDispatch } from 'react-redux';
import "./Sidebar.css";

function Sidebar() {
    const[name,setName]=useState("")
    const [friendsList, setFriendList] = useState([]);
    const [groupName, setGroupName] = useState('');
  const [memberName, setMemberName] = useState('');
  const [membersGroup, setMembersGroup] = useState([]);
  const [groups, setGroups] = useState([]);
  const [add,setAdd]=useState(false)
  const [del ,setDel]=useState(false)

  const handleButtonClickAdd = () => {
    setAdd(!add);
  };

  const handleButtonClickDel = () =>{
    setDel(!del)
  }

    const user =useSelector((state)=> state.user);
    const { socket, setMembers , members , setCurrentRoom,setRooms,privateMemberMsg, rooms, setPrivateMemberMsg,currentRoom}= useContext(AppContext);
   const dispatch =useDispatch()
   
    function getRooms(){
       fetch("http://localhost:5001/rooms")
      .then((res)=>res.json())
      .then((data)=>setRooms(data))
    }
    
      function orderIds(id1 , id2){
        if (id1 > id2){
          return id1 +"-"+ id2;  }
          else{
            return id2 +"-" +id1;
          }
      }
        

   function joinRoom(room , isPublic = true){
if(!user){
  return alert('Please login')
}
    socket.emit("join-room", room,currentRoom);
    setCurrentRoom(room);

    if(isPublic){
      setPrivateMemberMsg(null);

    }
 dispatch(resetNotifications(room));

 socket.off('notifications').on('notifications', (room)=>{
  dispatch(addNotifications(room));
 })
   }
   
  /*const handleAddMember = () => {
    setMembersGroup([...membersGroup, memberName]);
    setMemberName('');
  };
  const handleDeleteMember = (index) => {
    const updatedMembers = [...membersGroup];
    updatedMembers.splice(index, 1);
    setMembersGroup(updatedMembers);
  };
   */
    useEffect(()=>{
      if(user){

        socket.emit('new-user')
      }
    },[])




    socket.off("new-user").on("new-user",(payload)=>{
      console.log(payload)
      setMembers(payload)
      console.log(members)
    })

   function handlePrivateMemberMsg(member){
             setPrivateMemberMsg(member);
             const roomId = orderIds(user._id,member._id);
             joinRoom(roomId, false);

   }
   /*const handleFriendClick = async () => {
    try {
      const response = await fetch('http://localhost:5001/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: user._id, name: name }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add friend');
      }
  
      // Handle the response accordingly
      const responseData = await response.text();
      console.log(responseData);
  
      // Update the friendList state if the friend is not already added
      const isFriendAdded = friendList.find((friend) => friend[0]._id === userfriend[0]._id);
      if (!isFriendAdded) {
        setFriendList([...friendList, userfriend]);
      }
    } catch (error) {
      console.error(error);
    }
  };*/
  const handleFriendClick = async () => {
    
    try {
      const response = await fetch('http://localhost:5001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: user._id, name:name }),
      });
  
      if (!response.ok) {
        console.log(response)
        throw new Error('Failed to add friend');
      }
  
      const updatedUser = await response.json();

      console.log(updatedUser);
      setFriendList([...updatedUser.friendsList]);
      window.location.reload();
      console.log(friendsList)
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const response = await fetch(`http://localhost:5001/users/${user._id}/friends`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch friend list');
        }
        
        const friendListData = await response.json();
        setFriendList(friendListData);
      } catch (error) {
        console.error(error);
      }
    };
    
    // Call the fetchFriendList function
    fetchFriendList();
  }, []);
  

   const handleSubmit = (e) => {
    e.preventDefault()
   }  

  // ...



    /*const saveFriendList = async (userId, friendList) => {
      try {
        const response = await fetch('http://localhost:5001/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId:user._id, friendsList:friendList }),
        });
    
        if (!response.ok) {
          throw new Error('Error saving friend list');
        }
    
        console.log('Friend list saved:', user.friendsList);
      } catch (error) {
        alert('Error saving friend list:', error);
      }
    };*/
    const handleDeleteFriend = async (friendId) => {
      try {
        const response = await fetch(`http://localhost:5001/chat/${user._id}/friends/${friendId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to delete friend');
        }
    
        // Remove the friend from the friendList in the front-end
        const updatedFriendList = friendsList.filter((friend) => friend._id !== friendId);
        setFriendList(updatedFriendList);
      } catch (error) {
        console.error(error);
      }
    };
  
    
    
    const createGroup = async (userId, groupName) => {
      try {
        const response = await fetch('http://localhost:5001/groups', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, groupName }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to create group');
        }
    
        const group = await response.json();
        // Handle the created group data
        console.log(group);
        setGroupName("")
        //setGroups([...groups,group])
      } catch (error) {
        console.error(error);
      }
    };
    
    
    
    useEffect(() => {  
      const fetchMyGroups = async () => {
        // Fetch the groups created by the user from the back-end
        try {
          const response = await fetch(`http://localhost:5001/groups/created-by/${user._id}`);
    
          if (response.ok) {
            const data = await response.json();
            console.log(data.group)
            setGroups(data.group);
          } else {
            console.error('Failed to fetch user groups');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
      
      
      if (user) {
        // Fetch the user's created groups from the back-end
        fetchMyGroups()
      }
    }, [user]);


    const deleteGroup = async (groupId) => {
      try {
        const response = await fetch(`http://localhost:5001/groups/${groupId}`, {
          method: 'DELETE',
        });
    
        if (response.ok) {
          // Filter out the deleted group from the groups state
          setGroups(groups.filter(group => group._id !== groupId));
          setCurrentRoom("")
          console.log('Group deleted successfully');
        } else {
          console.error('Failed to delete group');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    const handleDeleteGroup = (groupId) => {
      if (window.confirm('Are you sure you want to delete this group?')) {
        deleteGroup(groupId);
      }
    };

   
    const addMemberToGroup = async () => {
      try {
        const response = await fetch('http://localhost:5001/addMember', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ groupName, memberName }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Member added to group:', data);
          // Perform any additional actions or UI updates
        } else {
          console.error('Failed to add member to group');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  


    if (!user){
      return 
      <>
      </>;
    }
    console.log(friendsList)
   // console.log(groups[0].name)
    console.log(user.groups)
    
    
  return (
  <div>
    <div>
      <h2>Create Group</h2>
      <form>
      <input
        type="text"
        placeholder="Group Name"
        className='input' 
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button className='btn btn-primary' onClick={()=>createGroup(user._id,groupName)}>Create Group</button>
      </form>
      </div>
      
      <div>
      <h2>My Groups</h2>
      <ListGroup>
      {groups.map((group) => (
       
        <ListGroup.Item  key={group._id} onClick={()=>joinRoom(group.name)} 
            active={group.name==currentRoom.name} style={{cursor:'pointer',display:'flex',justifyContent:'space-between',marginBottom:10,border:"2px red solid"}}>
                {group.name  }<form><i onClick={()=>handleDeleteGroup(group._id)} class="fa-sharp fa-solid fa-trash fa-beat"></i></form><i onClick={handleButtonClickDel}  class="fa-solid mt-1 fa-user-minus fa-beat"></i> <i onClick={handleButtonClickAdd}  class="fa-solid mt-1 fa-user-plus fa-beat"></i> {currentRoom.name !== group.name && <span className='badge rounded-pill bg-primary'>{user.newMessages[group.name]}</span>}
        </ListGroup.Item>
            
      ))}
      </ListGroup>
    </div>
    
      
    <ListGroup className='mb-5'>
      <div className='d-flex flex-column align-items-center'>
      <input type='text' className='input mb-3' placeholder="Member Name" style={{width:200}} value={memberName} onChange={e=>setMemberName(e.target.value)}  />
      {members.map((member)=>(
      member.name.toLowerCase()==memberName.toLowerCase() && member._id !=user._id ? (<ListGroup.Item key={member.id} style={{cursor:"pointer"}} 
      active={privateMemberMsg?._id==member?._id} 
      onClick={()=>handlePrivateMemberMsg(member)} disabled={member._id===user._id}>
        <Row>
          <Col xs={2} className="member-status">
            <img src={member.picture} className='member-status-img' />
            {member.status =="online" ? <i className='fas fa-circle sidebar-online-status'></i> : <i className='fas fa-circle sidebar-offline-status'></i>}
          </Col>
         <Col xs={9}>
          {member.name}
          {member._id === user?._id }
          {member.status =="offline"}
          </Col>
         
          <Col xs={1}>
            <span className='badge rounded-pill bg-primary'>{user.newMessages[orderIds(member._id, user._id)]}</span>
          </Col>
        </Row>
      
      </ListGroup.Item>
      )
       :<></>
       ))}
      <select className="select bg-body-secondary my-2" style={{width:200,height:30}} value={groupName} onChange={e => setGroupName(e.target.value)}>
  <option value="">Select Group</option>
  {groups.map(group => (
    <option key={group._id} value={group.name}>{group.name}</option>
  ))}
</select>
      <button className='btn btn-primary w-50' onClick={addMemberToGroup}>Add member</button>
      </div>
    
  </ListGroup>


    <h2 className='text-white'>Avaible rooms</h2>
    <ListGroup>
    <ul>
        {/*groups.map((group) => (
          <li key={group._id}>
            <h3>{group.name}</h3>
            <p>Members:</p>
            <ul>
              {group.members.map((member) => (
                <li key={member._id}>{member.name}</li>
              ))}
            </ul>
          </li>
              ))*/}
      </ul>
    {/*rooms.map((room, idx) => (
            <ListGroup.Item key={idx}onClick={()=>joinRoom(room)} 
            active={room==currentRoom} style={{cursor:'pointer',display:'flex',justifyContent:'space-between'}}>
                {room} {currentRoom !== room && <span className='badge rounded-pill bg-primary'>{user.newMessages[room]}</span>}
            </ListGroup.Item>
   
    ))*/}
    </ListGroup>
    
    <h2 className='text-white'>Members</h2>
    <ListGroup className='mb-5'>
      <form onSubmit={handleSubmit}>
      <input type='text' className='input' value={name} onChange={(e)=>setName((e.target.value))} />
      <Button onClick={handleFriendClick}>Add Friend</Button>
      </form>
    {members.map((member)=>(
      member.name.toLowerCase()==name.toLowerCase() && member._id !=user._id ? (<ListGroup.Item key={member.id} style={{cursor:"pointer"}} 
      active={privateMemberMsg?._id==member?._id} 
      onClick={()=>handlePrivateMemberMsg(member)} disabled={member._id===user._id}>
        <Row>
          <Col xs={2} className="member-status">
            <img src={member.picture} className='member-status-img' />
            {member.status =="online" ? <i className='fas fa-circle sidebar-online-status'></i> : <i className='fas fa-circle sidebar-offline-status'></i>}
          </Col>
         <Col xs={9}>
          {member.name}
          {member._id === user?._id && " (You)"}
          {member.status =="offline" && " (offline)"}
          </Col>
          <Col xs={1}>
            <span className='badge rounded-pill bg-primary'>{user.newMessages[orderIds(member._id, user._id)]}</span>
          </Col>
        </Row>
      
      </ListGroup.Item>) :<></>
        
  
    ))}


    </ListGroup>

    <ListGroup className='mt-5' style={{marginTop:50}}>
      {friendsList.map((friend)=>(
        friend._id!=user._id ?(<ListGroup.Item key={friend.id} style={{cursor:"pointer",marginBottom:10}} 
        active={privateMemberMsg?._id==friend?._id} 
        onClick={()=>handlePrivateMemberMsg(friend)} >
          <Row>
            <Col xs={2} className="member-status">
              <img src={friend.picture} className='member-status-img' />
              {friend.status =="online" ? <i className='fas fa-circle sidebar-online-status'></i> : <i className='fas fa-circle sidebar-offline-status'></i>}
            </Col>
           <Col xs={8}>
            {friend.name}
            {friend._id === user?._id}
            {friend.status =="offline" }
            </Col>

            <Col xs={1}>
              <span className='badge rounded-pill bg-primary'>{user.newMessages[orderIds(friend._id, user._id)]}</span>
            </Col>
           
            <Col xs={1}>
              <span onClick={()=>handleDeleteFriend(friend._id)}><i class="fa-solid fa-minus-circle fa-beat"></i></span>
            </Col>
            
          </Row>
        
        </ListGroup.Item>
):(<></>)
        
      ))
      
      }
    </ListGroup>
    </div>
  
  )

    }

export default Sidebar 