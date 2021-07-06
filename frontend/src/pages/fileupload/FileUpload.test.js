import React from 'react';
import FileUpload from './FileUpload';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<FileUpload />);
});

it('should return a <div>', () => {
    expect(shallowWrapper.type()).toEqual('div');
});

// Find the <div> element
it('able to find the <div> element', () => {
    expect(shallowWrapper.find('div').exists()).toEqual(true);
});

// Find the count of the <div> element.
it('able to find the count of <div> element', () => {
    expect(shallowWrapper.find('div').length).toBe(4);
});

// Find the <FontAwesomeIcon> element
it('able to find the <FontAwesomeIcon> element', () => {
    expect(shallowWrapper.find('FontAwesomeIcon').exists()).toEqual(true);
});

//Find the count of <FontAwesomeIcon> element
it('able to find the count of <FontAwesomeIcon> element', () => {
    expect(shallowWrapper.find('FontAwesomeIcon').length).toBe(1);
});

// Find the <Navbar> element
it('able to find the <Navbar> element', () => {
    expect(shallowWrapper.find('Navbar').exists()).toEqual(true);
});

//Find the count of <Navbar> element
it('able to find the count of <Navbar> element', () => {
    expect(shallowWrapper.find('Navbar').length).toBe(1);
});

// Find the <p> element
it('able to find the <p> element', () => {
    expect(shallowWrapper.find('p').exists()).toEqual(true);
});

//Find the count of <p> element
it('able to find the count of <p> element', () => {
    expect(shallowWrapper.find('p').length).toBe(2);
});

// Find the <input> element
it('able to find the <input> element', () => {
    expect(shallowWrapper.find('input').exists()).toEqual(true);
});

//Find the count of <input> element
it('able to find the count of <input> element', () => {
    expect(shallowWrapper.find('input').length).toBe(1);
});

