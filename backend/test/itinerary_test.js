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

// ─── WHAT IS HAPPENING HERE? ───────────────────────────────────────────────────
// We are testing each controller function WITHOUT connecting to MongoDB.
// sinon.stub() replaces the real database call with a fake one we control.
// This means tests run fast and never need the real database to be running.
// Each test follows the same 4-step pattern:
//   1. Set up a fake req (request) and res (response)
//   2. Stub the database method to return fake data
//   3. Call the controller function
//   4. Assert (check) the response was correct, then restore the stub
// ──────────────────────────────────────────────────────────────────────────────

// ─── CREATE ITINERARY TESTS ───────────────────────────────────────────────────
describe('CreateItinerary Function Test', () => {

  it('should create a new itinerary successfully', async () => {
    // Step 1: Fake incoming request — simulates a logged-in user submitting the form
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: { title: 'Paris Trip', startDate: '2025-06-01', endDate: '2025-06-07' },
    };

    // The fake itinerary object we expect the database to return
    const createdItinerary = { _id: new mongoose.Types.ObjectId(), ...req.body, createdBy: req.user._id };

    // Step 2: Stub Itinerary.create so it never touches the real database
    const createStub = sinon.stub(Itinerary, 'create').resolves(createdItinerary);

    // Fake response object — sinon.spy() records what gets called on it
    const res = {
      status: sinon.stub().returnsThis(), // .returnsThis() allows chaining: res.status(201).json(...)
      json: sinon.spy(),
    };

    // Step 3: Call the actual controller function
    await createItinerary(req, res);

    // Step 4: Assert the controller responded correctly
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdItinerary)).to.be.true;

    createStub.restore(); // clean up — remove the stub so other tests aren't affected
  });

  it('should return 400 if creation fails', async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: { title: 'Paris Trip', startDate: '2025-06-01', endDate: '2025-06-07' },
    };

    // Stub create to throw an error — simulates a database failure
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

// ─── GET ALL ITINERARIES TESTS ────────────────────────────────────────────────
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

// ─── UPDATE ITINERARY TESTS ───────────────────────────────────────────────────
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

// ─── DELETE ITINERARY TESTS ───────────────────────────────────────────────────
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