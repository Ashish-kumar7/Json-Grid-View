import React from 'react';
import HomePage from './HomePage';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<HomePage />);
});

it('should return a <div>', () => {
    expect(shallowWrapper.type()).toEqual('div');
});

// Find the text of <h1> element
it('able to find the text of <h1> element ', () => {
    expect(shallowWrapper.find('h1').text()).toEqual('JSON GRID VIEWER');
})

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
    expect(shallowWrapper.find('Col').length).toBe(2);
});

// Find the <div> element
it('able to find the <div> element', () => {
    expect(shallowWrapper.find('div').exists()).toEqual(true);
});

//Find the count of <div> element
it('able to find the count of <div> element', () => {
    expect(shallowWrapper.find('div').length).toBe(3);
});

// Find the <Button> element
it('able to find the <Button> element', () => {
    expect(shallowWrapper.find('Button').exists()).toEqual(true);
});

//Find the count of <Button> element
it('able to find the count of <Button> element', () => {
    expect(shallowWrapper.find('Button').length).toBe(1);
});

// Find the <p> element
it('able to find the <p> element', () => {
    expect(shallowWrapper.find('p').exists()).toEqual(true);
});

//Find the count of <p> element
it('able to find the count of <p> element', () => {
    expect(shallowWrapper.find('p').length).toBe(1);
});

// Find the <h1> element
it('able to find the <h1> element', () => {
    expect(shallowWrapper.find('h1').exists()).toEqual(true);
});

//Find the count of <h1> element
it('able to find the count of <h1> element', () => {
    expect(shallowWrapper.find('h1').length).toBe(1);
});

// Find the <Footer> element
it('able to find the <Footer> element', () => {
    expect(shallowWrapper.find('Footer').exists()).toEqual(false);
});

//Find the count of <Footer> element
it('able to find the count of <Footer> element', () => {
    expect(shallowWrapper.find('Footer').length).toBe(0);
});