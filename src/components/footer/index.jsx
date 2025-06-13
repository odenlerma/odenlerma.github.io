import React, { useCallback, useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';


import './style.scss';
import logo from '@assets/images/icon.png';
import audruey from '@assets/images/audruey.png';
import resume from '@assets/Audruey.pdf';


// eslint-disable-next-line react/prop-types
export const CUSTOM_FOOTER = ({ refs = [] }) => {
    return(
        <div className="mt-5 bg-primary w-100 py-2 px-5 d-flex justify-content-center align-items-center">
            <span className='text-light'>Designed and coded by Audruey Gana</span>
        </div>
    )
}