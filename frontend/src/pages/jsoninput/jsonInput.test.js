import React from 'react';
import JsonInput from './JsonInput';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<JsonInput />);
});

it('should return a <div>', () => {
    expect(shallowWrapper.type()).toEqual('div');
});

// Find the <Navbar> element
it('able to find the <Navbar> element', () => {
    expect(shallowWrapper.find('Navbar').exists()).toEqual(true);
});

// Find the count of the <Navbar> element.
it('able to find the count of <Navbar> element', () => {
    expect(shallowWrapper.find('Navbar').length).toBe(1);
});

// Find the <Container> element
it('able to find the <Container> element', () => {
    expect(shallowWrapper.find('Container').exists()).toEqual(true);
});

// Find the count of the <Container> element.
it('able to find the count of <Container> element', () => {
    expect(shallowWrapper.find('Container').length).toBe(1);
});

// Find the <Row> element
it('able to find the <Row> element', () => {
    expect(shallowWrapper.find('Row').exists()).toEqual(true);
});

// Find the count of the <Row> element.
it('able to find the count of <Row> element', () => {
    expect(shallowWrapper.find('Row').length).toBe(1);
});

// Find the <Col> element
it('able to find the <Col> element', () => {
    expect(shallowWrapper.find('Col').exists()).toEqual(true);
});

//Find the count of <Col> element
it('able to find the count of <Col> element', () => {
    expect(shallowWrapper.find('Col').length).toBe(1);
});

// Find the <Editor> element
it('able to find the <Editor> element', () => {
    expect(shallowWrapper.find('Editor').exists()).toEqual(true);
});

//Find the count of <Editor> element
it('able to find the count of <Editor> element', () => {
    expect(shallowWrapper.find('Editor').length).toBe(1);
});
