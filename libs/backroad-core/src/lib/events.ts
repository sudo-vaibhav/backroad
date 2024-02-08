import type { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { InitOptions } from 'react-ga4/types/ga4';
export type BackroadConfig =
  | undefined
  | {
      analytics?: {
        google?: string | InitOptions[];
      };
      theme?: 'light' | 'dark';
      server?: {
        port?: number;
      };
    };
export type ClientToServerEventTypes =
  | 'get_value'
  | 'set_value'
  | 'run_script'
  | 'unset_value';
type ConstructSocketIoEventSignatureFromBackroadEvents<
  T extends BackroadEvents
> = {
  [key in T]: (
    args: BackroadEventsMapping[key]['args'],
    callback: (callBackArgs: BackroadEventsMapping[key]['response']) => void
  ) => void;
};
export type ServerToClientEventTypes =
  | 'render'
  | 'running'
  | 'backroad_config'
  | 'props_change';
export type ClientToServerEvents =
  ConstructSocketIoEventSignatureFromBackroadEvents<ClientToServerEventTypes>;
export type ServerToClientEvents =
  ConstructSocketIoEventSignatureFromBackroadEvents<ServerToClientEventTypes>;
export type BackroadEventsMapping = {
  get_value: {
    args: { id: string; sessionId: string };
    response: string;
  };
  set_value: {
    args: {
      id: string;
      value: string;
      //  triggerRerun?: boolean
    };
    response?: void;
  };
  render: {
    args: string[]; //BackroadNode<true, false>;
    response?: void;
  };
  running: {
    args: null;
    response?: void;
  };
  props_change: {
    args: any;
    response?: void;
  };
  config: {
    args: { theme?: 'light' | 'dark' | undefined };
    response?: void;
  };
  run_script: {
    args?: void;
    response?: never;
  };
  unset_value: {
    args: { id: string };
    response?: void;
  };
  backroad_config: {
    args: BackroadConfig;
    response?: never;
  };
};
export type BackroadEvents = keyof BackroadEventsMapping;
export type ServerSocketType = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;
