import React from 'react';
import Navbar from './navbar';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<Navbar />);
});

it('should return a <div>', () => {
    expect(shallowWrapper.type()).toEqual('div');
});

// Find the text of <a> element
it('able to find the text of <a> element ', () => {
    expect(shallowWrapper.find('a').text()).toEqual('JSON Grid Viewer');
})

// Find the <div> element
it('able to find the <div> element', () => {
    expect(shallowWrapper.find('div').exists()).toEqual(true);
});

// Find the count of the <div> element.
it('able to find the count of <div> element', () => {
    expect(shallowWrapper.find('div').length).toBe(2);
});

// Find the <Button> element
it('able to find the <button> element', () => {
    expect(shallowWrapper.find('button').exists()).toEqual(true);
});

//Find the count of <button> element
it('able to find the count of <button> element', () => {
    expect(shallowWrapper.find('button').length).toBe(5);
});

// Find the <nav> element
it('able to find the <nav> element', () => {
    expect(shallowWrapper.find('nav').exists()).toEqual(true);
});

//Find the count of <nav> element
it('able to find the count of <nav> element', () => {
    expect(shallowWrapper.find('nav').length).toBe(1);
});

// Find the <a> element
it('able to find the <a> element', () => {
    expect(shallowWrapper.find('a').exists()).toEqual(true);
});

//Find the count of <a> element
it('able to find the count of <a> element', () => {
    expect(shallowWrapper.find('a').length).toBe(1);
});

//Find the <form> element
it('able to find the <form> element', () => {
    expect(shallowWrapper.find('form').exists()).toEqual(true);
});

//Find the count of <form> element
it('able to find the count of <form> element', () => {
    expect(shallowWrapper.find('form').length).toBe(1);
});

