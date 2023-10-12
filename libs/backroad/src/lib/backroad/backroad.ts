// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  defaultValueFallbacks,
  type BackroadComponent,
  type BackroadContainer,
  type BackroadNode,
  type ComponentPropsMapping,
  type ContainerPropsMapping,
  type GenericBackroadComponent,
  type InbuiltComponentTypes,
  type InbuiltContainerTypes,
} from '@backroad/core';
import { omit } from 'lodash';
import superjson from 'superjson';
import { BackroadSession } from '../server/sessions/session';
import { ObjectHasher } from './object-hasher';
type BackroadComponentFormat<ComponentType extends InbuiltComponentTypes> = {
  id?: BackroadComponent<ComponentType, false>['id'];
} & BackroadComponent<ComponentType, false>['args'];

type BackroadContainerFormat<ContainerType extends InbuiltContainerTypes> =
  BackroadContainer<ContainerType, false>['args'];

/**
 * Manages the addition of nodes to the tree and also returns vaulues where applicable
 */

export class BackroadNodeManager<
  ContainerType extends InbuiltContainerTypes = 'page'
> {
  constructor(
    public container: BackroadContainer<ContainerType, false>,
    private backroadSession: BackroadSession
  ) {}

  private getAutoGeneratedId<T extends InbuiltComponentTypes>(
    props: BackroadComponentFormat<T>,
    type: T
  ) {
    const autoGeneratedIdInputs = {
      ...omit(props, ['id', 'defaultValue']),
      type,
    };
    return ObjectHasher.hash(autoGeneratedIdInputs);
  }

  #constructContainerObject<T extends InbuiltContainerTypes>(
    props: BackroadContainerFormat<T>,
    type: T
  ) {
    const nodePath = this.#getDescendantKey();
    const containerNode = {
      path: nodePath,
      args: props as unknown as ContainerPropsMapping[T]['args'],
      type: type,
    };

    return containerNode;
  }

  #addContainerDescendant<ContainerType extends InbuiltContainerTypes>(
    containerNodeData: Omit<
      BackroadContainer<ContainerType>,
      'path' | 'children'
    > & {
      children?: BackroadContainer<ContainerType, false>['children'];
    }
  ) {
    const containerNode = {
      ...containerNodeData,
      path: this.#getDescendantKey(),
      children: [],
    };
    this.container.children.push(containerNode);
    this.backroadSession.renderQueue.addToQueue(
      this.#getRenderPayload(containerNode, this.backroadSession)
    );
    return new BackroadNodeManager(
      containerNode as BackroadContainer<ContainerType>,
      this.backroadSession
    );
  }

  getOrDefault<T>(id: string, defaultValue: T) {
    this.backroadSession.setValueIfNotSet(id, defaultValue);
    return JSON.parse(JSON.stringify(this.backroadSession.valueOf(id))) as T;
  }
  setValue(id: string, value: any) {
    this.backroadSession.setValue(id, value);
  }
  // you should not have to call this manually
  // use initialiseAndAddComponentDescendant instead
  #addComponentDescendant<ComponentType extends InbuiltComponentTypes>(
    nodeData: BackroadComponent<ComponentType, false>
  ) {
    const castedNodeData = nodeData as GenericBackroadComponent;
    this.container.children.push(castedNodeData);
    this.backroadSession.renderQueue.addToQueue(
      this.#getRenderPayload(castedNodeData, this.backroadSession)
    );
    return this.backroadSession.valueOf<ComponentType>(nodeData.id);
  }
  // you should not have to call this manually
  // use initialiseAndAddComponentDescendant instead
  #initialiseAndConstructComponentObject<T extends InbuiltComponentTypes>(
    props: BackroadComponentFormat<T>,
    type: T
  ) {
    const nodePath = this.#getDescendantKey();
    const componentId = props.id || this.getAutoGeneratedId(props, type);
    this.backroadSession.setValueIfNotSet(
      componentId,
      'defaultValue' in props
        ? props.defaultValue
        : typeof defaultValueFallbacks[type] === 'function'
        ? defaultValueFallbacks[type]({ args: props })
        : type in defaultValueFallbacks
        ? defaultValueFallbacks[type]
        : null
    );
    const componentNode = {
      id: componentId,
      path: nodePath,
      args: omit(props, [
        'id',
        'type',
        'defaultValue',
      ]) as unknown as ComponentPropsMapping[T]['args'],
      type: type,
    };

    return componentNode;
  }
  #initialiseAndAddComponentDescendant<T extends InbuiltComponentTypes>(
    props: BackroadComponentFormat<T>,
    type: T
  ) {
    return this.#addComponentDescendant(
      this.#initialiseAndConstructComponentObject(props, type)
    );
  }
  #getRenderPayload(
    node: BackroadNode<false, false>,
    session: BackroadSession
  ) {
    if ('id' in node) {
      return superjson.stringify({ ...node, value: session.valueOf(node.id) });
    }
    return superjson.stringify(node);
  }
  #getDescendantKey() {
    return `${this.container.path ? this.container.path + '.' : ''}children.${
      this.container.children.length
    }`;
  }
  sidebar(props: BackroadContainerFormat<'sidebar'>) {
    return this.#addContainerDescendant(
      this.#constructContainerObject(props, 'sidebar')
    );
  }
  base(props: BackroadContainerFormat<'base'>) {
    return this.#addContainerDescendant(
      this.#constructContainerObject(props, 'base')
    );
  }
  page(props: BackroadContainerFormat<'page'>) {
    return this.backroadSession.rootNodeManager.#addContainerDescendant(
      this.#constructContainerObject(props, 'page')
    );
  }
  columns(props: BackroadContainerFormat<'columns'>) {
    const columnsContainer = this.#addContainerDescendant(
      this.#constructContainerObject(props, 'columns')
    );
    return [...Array(props.columnCount)].map(() =>
      columnsContainer.#addContainerDescendant({ type: 'base', args: {} })
    );
  }
  collapse(props: BackroadContainerFormat<'collapse'>) {
    return this.#addContainerDescendant(
      this.#constructContainerObject(props, 'collapse')
    );
  }
  tabs(props: BackroadContainerFormat<'tabs'>) {
    const tabsContainer = this.#addContainerDescendant(
      this.#constructContainerObject(props, 'tabs')
    );
    return [...Array(props.labels.length)].map(() =>
      tabsContainer.#addContainerDescendant({ type: 'base', args: {} })
    );
  }
  chatMessage(props: BackroadContainerFormat<'chat_message'>) {
    return this.#addContainerDescendant(
      this.#constructContainerObject(props, 'chat_message')
    );
  }

  link(props: BackroadComponentFormat<'link'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'link');
  }
  linkGroup(props: BackroadComponentFormat<'link_group'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'link_group');
  }
  stats(props: BackroadComponentFormat<'stats'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'stats');
  }
  multiselect(props: BackroadComponentFormat<'multiselect'>) {
    const val = this.#initialiseAndAddComponentDescendant(props, 'multiselect');

    return val;
  }
  json(props: BackroadComponentFormat<'json'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'json');
  }
  title(props: BackroadComponentFormat<'title'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'title');
  }

  button(props: BackroadComponentFormat<'button'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'button');
  }
  numberInput(props: BackroadComponentFormat<'number_input'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'number_input');
  }
  write(props: BackroadComponentFormat<'markdown'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'markdown');
  }
  line(props: BackroadComponentFormat<'line_chart'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'line_chart');
  }
  select(props: BackroadComponentFormat<'select'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'select');
  }
  image(props: BackroadComponentFormat<'image'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'image');
  }
  table(props: BackroadComponentFormat<'table'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'table');
  }
  bar(props: BackroadComponentFormat<'bar_chart'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'bar_chart');
  }
  pie(props: BackroadComponentFormat<'pie_chart'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'pie_chart');
  }
  doughnut(props: BackroadComponentFormat<'doughnut_chart'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'doughnut_chart');
  }
  radar(props: BackroadComponentFormat<'radar_chart'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'radar_chart');
  }
  scatter(props: BackroadComponentFormat<'scatter_chart'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'scatter_chart');
  }
  chatInput(props: BackroadComponentFormat<'chat_input'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'chat_input');
  }
  colorPicker(props: BackroadComponentFormat<'color_picker'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'color_picker');
  }
  checkbox(props: BackroadComponentFormat<'checkbox'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'checkbox');
  }
  toggle(props: BackroadComponentFormat<'toggle'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'toggle');
  }
  radio(props: BackroadComponentFormat<'radio'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'radio');
  }
  textInput(props: BackroadComponentFormat<'text_input'>) {
    return this.#initialiseAndAddComponentDescendant(props, 'text_input');
  }
}
