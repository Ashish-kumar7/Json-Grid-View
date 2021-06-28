import React from 'react';
import JsonChecker from './JsonChecker';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<JsonChecker />);
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

// Find the <h2> element
it('able to find the <h2> element', () => {
    expect(shallowWrapper.find('h2').exists()).toEqual(true);
});

// Find the count of the <h2> element.
it('able to find the count of <h2> element', () => {
    expect(shallowWrapper.find('h2').length).toBe(1);
});

// Find the <div> element
it('able to find the <div> element', () => {
    expect(shallowWrapper.find('div').exists()).toEqual(true);
});

// Find the count of the <div> element.
it('able to find the count of <div> element', () => {
    expect(shallowWrapper.find('div').length).toBe(2);
});

// Find the <JSONInput> element
it('able to find the <JSONInput> element', () => {
    expect(shallowWrapper.find('JSONInput').exists()).toEqual(true);
});

//Find the count of <JSONInput> element
it('able to find the count of <JSONInput> element', () => {
    expect(shallowWrapper.find('JSONInput').length).toBe(1);
});

// Find the <Button> element
it('able to find the <Button> element', () => {
    expect(shallowWrapper.find('Button').exists()).toEqual(true);
});

//Find the count of <Button> element
it('able to find the count of <Button> element', () => {
    expect(shallowWrapper.find('Button').length).toBe(1);
});

// Find the <Footer> element
it('able to find the <Footer> element', () => {
    expect(shallowWrapper.find('Footer').exists()).toEqual(true);
});

//Find the count of <Footer> element
it('able to find the count of <Footer> element', () => {
    expect(shallowWrapper.find('Footer').length).toBe(1);
});