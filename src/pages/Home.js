import React from 'react'
import {Row,Col,Button} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import './Home.css';
import About from './monsite/About';
import HomePage from './monsite/HomePage';
import Services from './monsite/Services';
import Contact from './monsite/Contact';
import { useSelector } from 'react-redux';

function Home() {
    const user = useSelector((state)=>state.user)
  return<div className='Home'>
  <HomePage/>
   <Row className='home_bg mb-1'>
<Col md={6} className='d-flex flex-direction-column align-items-center justify-content-center'>
    <div>
        <h1>Share the world with your friends</h1>
        <p className='fs-4'>TalkSquad lets you connect with the world</p>
        <LinkContainer to={!user ? "/login" : "/chat" }>
            <Button className='fs-5' variant='success'>
                get started
            
            <i className='fas fa-comments home-message-icon'></i>
            </Button>

        </LinkContainer>
     
        
        


    </div>
</Col >
<Col md={6} className='d-flex flex-direction-column align-items-center justify-content-center'>
<div class="text-container">
    <h1 className='fs-1'>TalkSquad</h1><br></br>
    <h1 className='fs-3'>Let's Build Our Community</h1>
    
  </div>

</Col>

</Row>


<Services/>
<About/>
<Contact/>


        </div>
}

export default Home;