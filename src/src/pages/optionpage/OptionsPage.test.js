import React from 'react';
import OptionsPage from './OptionsPage';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ShallowWrapper } from 'enzyme';

configure({ adapter: new Adapter() });

let shallowWrapper = ShallowWrapper;

beforeEach(() => {
    shallowWrapper = shallow(<OptionsPage />);
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
    expect(shallowWrapper.find('Col').length).toBe(3);
});

// Find the <Button> element
it('able to find the <Button> element', () => {
    expect(shallowWrapper.find('Button').exists()).toEqual(true);
});

//Find the count of <Button> element
it('able to find the count of <Button> element', () => {
    expect(shallowWrapper.find('Button').length).toBe(3);
});

// Find the <IconBox> element
it('able to find the <IconBox> element', () => {
    expect(shallowWrapper.find('IconBox').exists()).toEqual(true);
});

//Find the count of <IconBox> element
it('able to find the count of <IconBox> element', () => {
    expect(shallowWrapper.find('IconBox').length).toBe(3);
});

