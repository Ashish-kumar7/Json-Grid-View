import React from 'react';
import QueryPage from './querypage';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<QueryPage />);
});

it('should return a <React.Fragment>', () => {
    expect(shallowWrapper.type().toString()).toEqual(React.Fragment.toString());
});

// Find the text of <button> element
it('able to find the text of <button> element ', () => {
    expect(shallowWrapper.find('button').text()).toEqual('Send');
})

// Find the <div> element
it('able to find the <div> element', () => {
    expect(shallowWrapper.find('div').exists()).toEqual(true);
});

// Find the count of the <div> element.
it('able to find the count of <div> element', () => {
    expect(shallowWrapper.find('div').length).toBe(1);
});

// Find the <form> element
it('able to find the <form> element', () => {
    expect(shallowWrapper.find('form').exists()).toEqual(true);
});

// Find the count of the <form> element.
it('able to find the count of <form> element', () => {
    expect(shallowWrapper.find('form').length).toBe(1);
});

// Find the <input> element
it('able to find the <input> element', () => {
    expect(shallowWrapper.find('input').exists()).toEqual(true);
});

//Find the count of <input> element
it('able to find the count of <input> element', () => {
    expect(shallowWrapper.find('input').length).toBe(1);
});

// Find the <button> element
it('able to find the <button> element', () => {
    expect(shallowWrapper.find('button').exists()).toEqual(true);
});

//Find the count of <button> element
it('able to find the count of <button> element', () => {
    expect(shallowWrapper.find('button').length).toBe(1);
});

// Find the <Row> element
it('able to find the <Row> element', () => {
    expect(shallowWrapper.find('Row').exists()).toEqual(true);
});

//Find the count of <Row> element
it('able to find the count of <Row> element', () => {
    expect(shallowWrapper.find('Row').length).toBe(3);
});

// Find the <Container> element
it('able to find the <Container> element', () => {
    expect(shallowWrapper.find('Container').exists()).toEqual(true);
});

//Find the count of <Container> element
it('able to find the count of <Container> element', () => {
    expect(shallowWrapper.find('Container').length).toBe(1);
});

// Find the <Navbar> element
it('able to find the <Navbar> element', () => {
    expect(shallowWrapper.find('Navbar').exists()).toEqual(true);
});

//Find the count of <Navbar> element
it('able to find the count of <Navbar> element', () => {
    expect(shallowWrapper.find('Navbar').length).toBe(1);
});