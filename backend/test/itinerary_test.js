const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Itinerary = require('../models/Itinerary');
const {
  createItinerary,
  getItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary,
} = require('../controllers/itineraryController');
const { expect } = chai;


// CREATE ITINERARY TESTS
describe('CreateItinerary Function Test', () => {

  it('should create a new itinerary successfully', async () => {
    // Fake incoming request

    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: { title: 'Paris Trip', startDate: '2025-06-01', endDate: '2025-06-07' },
    };

    const createdItinerary = { _id: new mongoose.Types.ObjectId(), ...req.body, createdBy: req.user._id };

    // Stub Itinerary.create so it never touches the real database
    const createStub = sinon.stub(Itinerary, 'create').resolves(createdItinerary);

    const res = {
      status: sinon.stub().returnsThis(), // .returnsThis() allows chaining: res.status(201).json(...)
      json: sinon.spy(),
    };


    // Call actual controller function
    await createItinerary(req, res);

    // Assert controller responded correctly
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdItinerary)).to.be.true;

    createStub.restore();

  });

  it('should return 400 if creation fails', async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: { title: 'Paris Trip', startDate: '2025-06-01', endDate: '2025-06-07' },
    };


    // Stub create to throw an error

    const createStub = sinon.stub(Itinerary, 'create').throws(new Error('DB Error'));

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createItinerary(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    createStub.restore();
  });
});


// GET ALL ITINERARIES TESTS

describe('GetItineraries Function Test', () => {

  it('should return all itineraries for the user', async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
    };

    const fakeList = [
      { _id: new mongoose.Types.ObjectId(), title: 'Paris Trip', createdBy: req.user._id },
      { _id: new mongoose.Types.ObjectId(), title: 'Tokyo Trip', createdBy: req.user._id },
    ];



    // Itinerary.find().sort() is a chain — we stub find to return an object with a sort method

    const findStub = sinon.stub(Itinerary, 'find').returns({
      sort: sinon.stub().resolves(fakeList),
    });

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getItineraries(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(fakeList)).to.be.true;

    findStub.restore();
  });

  it('should return 500 if fetching fails', async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
    };

    const findStub = sinon.stub(Itinerary, 'find').returns({
      sort: sinon.stub().throws(new Error('DB Error')),
    });

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getItineraries(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    findStub.restore();
  });
});


// UPDATE ITINERARY TESTS


describe('UpdateItinerary Function Test', () => {

  it('should update an itinerary successfully', async () => {
    const itineraryId = new mongoose.Types.ObjectId();
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      params: { id: itineraryId },
      body: { title: 'Paris Trip Updated' },
    };

    const updatedItinerary = { _id: itineraryId, title: 'Paris Trip Updated', createdBy: req.user._id };

    const updateStub = sinon.stub(Itinerary, 'findOneAndUpdate').resolves(updatedItinerary);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateItinerary(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(updatedItinerary)).to.be.true;

    updateStub.restore();
  });

  it('should return 404 if itinerary not found', async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      params: { id: new mongoose.Types.ObjectId() },
      body: { title: 'Does Not Exist' },
    };


    // Resolves with null — simulates the itinerary not belonging to this user
    const updateStub = sinon.stub(Itinerary, 'findOneAndUpdate').resolves(null);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateItinerary(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Itinerary not found' })).to.be.true;

    updateStub.restore();
  });
});


// DELETE ITINERARY TESTS 

describe('DeleteItinerary Function Test', () => {

  it('should delete an itinerary successfully', async () => {
    const itineraryId = new mongoose.Types.ObjectId();
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      params: { id: itineraryId },
    };

    const deletedItinerary = { _id: itineraryId, title: 'Paris Trip' };

    const deleteStub = sinon.stub(Itinerary, 'findOneAndDelete').resolves(deletedItinerary);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteItinerary(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Itinerary deleted successfully' })).to.be.true;

    deleteStub.restore();
  });

  it('should return 404 if itinerary not found', async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      params: { id: new mongoose.Types.ObjectId() },
    };

    const deleteStub = sinon.stub(Itinerary, 'findOneAndDelete').resolves(null);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteItinerary(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Itinerary not found' })).to.be.true;

    deleteStub.restore();
  });
});