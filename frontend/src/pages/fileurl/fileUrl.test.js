import React from 'react';
import FileUrl from './FileUrl';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<FileUrl />);
});

it('should return a <div>', () => {
    expect(shallowWrapper.type()).toEqual('div');
});

// Find the text of <label> element
it('able to find the text of <label> element ', () => {
    expect(shallowWrapper.find('label').text()).toEqual('URL');
})

// Find the <div> element
it('able to find the <div> element', () => {
    expect(shallowWrapper.find('div').exists()).toEqual(true);
});

// Find the count of the <div> element.
it('able to find the count of <div> element', () => {
    expect(shallowWrapper.find('div').length).toBe(2);
});

// Find the <Navbar> element
it('able to find the <Navbar> element', () => {
    expect(shallowWrapper.find('Navbar').exists()).toEqual(true);
});

//Find the count of <Navbar> element
it('able to find the count of <Navbar> element', () => {
    expect(shallowWrapper.find('Navbar').length).toBe(1);
});

// Find the <label> element
it('able to find the <label> element', () => {
    expect(shallowWrapper.find('label').exists()).toEqual(true);
});

//Find the count of <label> element
it('able to find the count of <label> element', () => {
    expect(shallowWrapper.find('label').length).toBe(1);
});

// Find the <Button> element
it('able to find the <Button> element', () => {
    expect(shallowWrapper.find('Button').exists()).toEqual(true);
});

//Find the count of <Button> element
it('able to find the count of <Button> element', () => {
    expect(shallowWrapper.find('Button').length).toBe(1);
});
