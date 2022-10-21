import { Dispatch } from "react";
import { Button, Form, FormControl, InputGroup, Modal, Spinner } from "react-bootstrap"
import { LatLng } from "leaflet";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { IPostCheckinRequest, PostCheckinAction } from "../api/postCheckin";

interface IParams {
    show: boolean,
    setShow: Dispatch<React.SetStateAction<{show: boolean, coords: LatLng | undefined}>>,
    coords: LatLng | undefined,
}

interface IFormValues {
    startTime: string,
    endTime: string,
}

function PostCheckinModal({ show, setShow, coords }: IParams) {
    const { handleSubmit, register} = useForm<IFormValues>()
    const { game, currentPlayer } = useAppSelector(state => state.game);
    const [requestLoading, requestError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PostCheckin);
    const dispatch = useAppDispatch();

    const hide = () => { setShow({show: false, coords: undefined}); }
    const handleOnSubmit = handleSubmit((data) => {
        const request: IPostCheckinRequest = {
            start_time: data.startTime,
            end_time: data.endTime,
            latitude: coords!.lat,
            longitude: coords!.lng,
            squad_MemberId: currentPlayer!.squadMemberId!,
        }
        const action = PostCheckinAction(game!.id, currentPlayer!.squadId!, request, hide);
        dispatch(action);
    });
    if(!coords) return null
    return (
        <Modal show={show} onEscapeKeyDown={hide} onHide={hide}>
            <Modal.Header >
                <Modal.Title>Add a checkin that all your squad members can see!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleOnSubmit}>
                    <InputGroup >
                        <InputGroup.Text id="startTime">Start Time</InputGroup.Text>
                        <FormControl
                            aria-label="startTime"
                            aria-describedby="startTime"
                            type="datetime-local"
                            defaultValue={new Date().toISOString().slice(0, -8)}
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
                            defaultValue={new Date().toISOString().slice(0, -8)}
                            {...register('endTime')}
                        />
                    </InputGroup>
                    <InputGroup >
                        <InputGroup.Text id="latitude">Latitude</InputGroup.Text>
                        <FormControl
                            aria-label="latitude"
                            aria-describedby="latitude"
                            value={coords.lat}
                            readOnly
                        />
                    </InputGroup>
                    <InputGroup >
                        <InputGroup.Text id="longtitude">Longtitude</InputGroup.Text>
                        <FormControl
                            aria-label="longtitude"
                            aria-describedby="longtitude"
                            value={coords.lng}
                            readOnly
                        />
                    </InputGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={hide}>Cancel</Button>
                {requestError && <span style={{ fontStyle: 'italic' }}>{requestError.message}</span>}
                <Button variant="dark" type="submit" onClick={handleOnSubmit}>
                    {requestLoading ? <Spinner animation="border" /> : <span>Submit</span>}
                </Button>
            </Modal.Footer>
        </Modal>);
}

export default PostCheckinModal