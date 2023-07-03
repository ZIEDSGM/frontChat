import React,{useState} from 'react';
import{useLoginUserMutation}from "../services/appApi";
import {Col,Container,Row,Button, Spinner} from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

function Logins() {
  const[email,setEmail]=useState('')
  const[password,setPassword]=useState("")
  const navigate = useNavigate();
  const {socket}= useContext(AppContext);


  const[loginUser,{isLoading,error}]=useLoginUserMutation();
  function handleLogin(e){
e.preventDefault();
loginUser({ email, password}).then (({data}) =>{
  if (data) {
    
    socket.emit("new-user")

    navigate("/chat") ;
  }
})
  }




  
  return (
    
        <div className='login' >
            
        <Col md={12} className='d-flex justify-content-center align-items-center text-white '>
    <Form style={{width:"50%" , maxWidth:500,marginTop:250}} onSubmit={handleLogin}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        {error && <p className='alert alert-danger'>{error.data}</p>}
        <Form.Label className='fs-3' >Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" onChange={(e)=> setEmail(e.target.value)} value={email} required />
        <Form.Text className=" text-white ">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label className='fs-3'>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={(e)=> setPassword(e.target.value)} value={password} required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit">
        {isLoading ? <Spinner animation="grow"/>: "Login"}
       
      </Button>
      <div className="py-4">
        <p className="text-center fs-4">
            Don't have an account ? <button className="glow-on-hover" style={{width:"auto"}}><Link to="/signup" className=' text-white text-decoration-none'>Signup</Link></button>
            </p>
      </div>
    </Form>
    </Col>
    </div>
    
  );
}

export default Logins;