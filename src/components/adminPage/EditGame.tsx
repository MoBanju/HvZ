import { LatLngBoundsLiteral, LatLngTuple } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { Button, Container, Form, FormControl, InputGroup, Spinner } from "react-bootstrap"
import { useForm } from "react-hook-form";
import { MapContainer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { IGame } from "../../models/IGame"
import { IGameState } from "../../models/IGameState";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { DeleteGameByIdAction } from "../api/deleteGameById";
import { PutGameByIdAction } from "../api/putGameById";
import DeleteGameModal from "../landingPage/DeleteGameModal";
import DraggableMap from "../landingPage/DraggableMap";
import { HideEditFormFnc } from "./EditItem";

interface IParams {
  game: IGame,
  closeForm: HideEditFormFnc,
}

interface IFormValues {
  name: string,
  description: string,
  state: string,
  startTime: string,
  endTime: string,
  sw_latitude: number,
  sw_longtitude: number,
  ne_latitude: number,
  ne_longtitude: number,
}

function EditGame({ game, closeForm }: IParams) {
  const center = useMemo(() => [(game!.ne_lat + game!.sw_lat) / 2, (game!.ne_lng + game!.sw_lng) / 2], [game]) as LatLngTuple
  const { handleSubmit, register, setValue, formState } = useForm<IFormValues>();
  const [boxBounds, setBoxBounds] = useState<LatLngBoundsLiteral>([[game.sw_lat, game.sw_lng], [game.ne_lat, game.ne_lng]]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestPutLoading, requestPutError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PutGameById);
  const [requestDeleteLoading, requestDeleteError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.DeleteGameById);
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    setValue('sw_latitude', boxBounds[0][0])
    setValue('sw_longtitude', boxBounds[0][1])
    setValue('ne_latitude', boxBounds[1][0])
    setValue('ne_longtitude', boxBounds[1][1])
  }, [boxBounds]);

  const handleDeleteKill = () => {
    const action = DeleteGameByIdAction(game.id, () => { nav("/") });
    dispatch(action);
  };

  const handleDeleteBtnClicked = () => { setShowDeleteModal(true) }

  const handleOnSubmit = handleSubmit((data) => {
    const state = data.state as keyof IGameState;

    const updatedGame: IGame = {
      id: game.id,
      name: data.name,
      description: data.description,
      state,
      playerCount: game.playerCount,
      ne_lat: data.ne_latitude,
      ne_lng: data.ne_longtitude,
      sw_lat: data.sw_latitude,
      sw_lng: data.sw_longtitude,
      startTime: data.startTime,
      endTime: data.endTime,
    };
    const action = PutGameByIdAction(updatedGame, state, () => {closeForm(`Successfully edited game ${game.id}`)});
    dispatch(action);
  });


  return (<>
    <h1>Edit {game.name}</h1>
    <Form onSubmit={handleOnSubmit}>
      <InputGroup >
        <InputGroup.Text id="id" >Id</InputGroup.Text>
        <FormControl
          aria-label="Id"
          aria-describedby="id"
          value={game.id}
          readOnly
        />
      </InputGroup>
      <InputGroup >
        <InputGroup.Text id="name" >Name</InputGroup.Text>
        <FormControl
          aria-label="name"
          aria-describedby="name"
          defaultValue={game.name}
          required
          {...register("name", {
            required: { value: true, message: "Name is required for a game" },
            maxLength: { value: 50, message: "Name cant be longer than 50 characters" },

          })}
        />
        <FormControl.Feedback type="invalid" style={{ display: "unset" }}>
          {formState.errors.name && formState.errors.name.message}
        </FormControl.Feedback>
      </InputGroup>
      <InputGroup >
        <InputGroup.Text id="description">Description</InputGroup.Text>
        <FormControl
          as="textarea"
          aria-label="description"
          aria-describedby="description"
          defaultValue={game.description}
          required
          {...register("description", {
            required: true,
            maxLength: 800,
          })}
        />
        <FormControl.Feedback type="invalid" style={{ display: "unset" }}>
          {formState.errors.description && formState.errors.description.message}
        </FormControl.Feedback>
      </InputGroup>
      <InputGroup >
        <InputGroup.Text id="startTime">Start Time</InputGroup.Text>
        <FormControl
          aria-label="startTime"
          aria-describedby="startTime"
          type="datetime-local"
          defaultValue={new Date(game.startTime).toISOString().slice(0, -8)}
          {...register('startTime', {
            required: true,
          })}
        />
      </InputGroup>
      <InputGroup >
        <InputGroup.Text id="endTime">End Time</InputGroup.Text>
        <FormControl
          aria-label="endTime"
          aria-describedby="endTime"
          type="datetime-local"
          defaultValue={new Date(game.endTime).toISOString().slice(0, -8)}
          {...register('endTime')}
        />
      </InputGroup>
      <Form.Select {...register("state")}>
        <option value="Registration">Register</option>
        <option value="Progress">Progress</option>
        <option value="Complete">Complete</option>
      </Form.Select>
      <InputGroup >
        <InputGroup.Text id="sw_latitude">South West Latitude</InputGroup.Text>
        <FormControl
          aria-label="sw_latitude"
          aria-describedby="sw_latitude"
          defaultValue={game.sw_lat}
          readOnly
          {...register('sw_latitude')}
        />
      </InputGroup>
      <InputGroup >
        <InputGroup.Text id="sw_longtitude">South West Longtitude</InputGroup.Text>
        <FormControl
          aria-label="sw_longtitude"
          aria-describedby="sw_longtitude"
          defaultValue={game.sw_lng}
          readOnly
          {...register('sw_longtitude')}
        />
      </InputGroup>
      <InputGroup >
        <InputGroup.Text id="ne_latitude">North East Latitude</InputGroup.Text>
        <FormControl
          aria-label="ne_latitude"
          aria-describedby="ne_latitude"
          defaultValue={game.ne_lat}
          readOnly
          {...register('ne_latitude')}
        />
      </InputGroup>
      <InputGroup >
        <InputGroup.Text id="ne_longtitude">North East Longtitude</InputGroup.Text>
        <FormControl
          aria-label="ne_longtitude"
          aria-describedby="ne_longtitude"
          defaultValue={game.ne_lng}
          readOnly
          {...register('ne_longtitude')}
        />
      </InputGroup>
      <MapContainer center={center} zoom={13} style={{ height: "500px", width: "600px" }}>
        <DraggableMap
          position={center}
          boxBounds={boxBounds}
          setBoxBounds={setBoxBounds}
          setPosition={() => { }}
        />
      </MapContainer>
      <Container>
        <Button variant="danger" onClick={handleDeleteBtnClicked}>
          {requestDeleteLoading ? <Spinner animation="border" /> : <span>Delete</span>}
        </Button>
        {requestDeleteError && <span style={{ fontStyle: 'italic' }}>{requestDeleteError.message}</span>}
        {requestPutError && <span style={{ fontStyle: 'italic' }}>{requestPutError.message}</span>}
        <Button className="float-end" type="submit">
          {requestPutLoading ? <Spinner animation="border" /> : <span>Submit</span>}
        </Button>
      </Container>

    </Form>
    <DeleteGameModal
      game={game}
      show={showDeleteModal}
      setShow={setShowDeleteModal}
      handleSubmit={handleDeleteKill}
    />
  </>)
}

export default EditGame