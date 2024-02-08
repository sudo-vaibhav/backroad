import type { TypedChartComponent } from 'react-chartjs-2/dist/types';
import type { Props } from 'react-select';
import type { ColumnHelper } from '@tanstack/react-table';
import { HTMLProps } from 'react';
import formidable from 'formidable';
import type { DropzoneOptions } from 'react-dropzone';
// import { v4 as uuidv4 } from 'uuid';
// type FileUploadObject = {
//   id: string;
//   // constructor() {
//   //   this.id = '';
//   //   // this.id = uuidv4();
//   // }
// };

export type SelectOptionType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  label: string;
};
type SelectValueType = SelectOptionType['value'];
type AllowDefaultHelper<T> = T extends {
  args: infer ArgsType;
  value: infer ValueType;
}
  ? { args: ArgsType & { defaultValue?: ValueType }; value: ValueType }
  : never;
type _ComponentBasePropsMapping = {
  number_input: AllowDefaultHelper<{
    args: {
      label: string;
      min?: number;
      max?: number;
      step?: number;
      precision?: number;
    };
    value: number;
  }>;
  markdown: {
    args: { body: string | number };
    value: null;
  };
  button: {
    args: {
      label: string;
    };
    value: boolean;
  };

  select: AllowDefaultHelper<{
    readonly args: {
      // options: any[];
      label?: string;
      // formatOption?: (option: any) => string;
    } & Omit<
      Props<SelectOptionType, false>,
      'onChange' | 'isMulti' | 'defaultValue'
    >;

    value: SelectValueType;
  }>;
  multiselect: {
    args: {
      // options: any[];
      label?: string;
      // formatOption?: (option: any) => string;
    } & Omit<Props<SelectOptionType, true>, 'onChange'>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any[];
  };
  image: {
    args: HTMLProps<HTMLImageElement>;
    value: null;
  };
  link: {
    args: { label: string; href: string; target?: string };
    value: null;
  };
  link_group: {
    args: {
      items: {
        label?: string;
        href: string;
        target?: string;
      }[];
    };
    value: null;
  };
  stats: {
    args: {
      items: {
        label: string;
        value: string | number;
        delta?: string | number;
      }[];
    };
    value: null;
  };
  json: {
    args: {
      src: object;
    };
    value: null;
  };
  title: {
    args: {
      label: string;
    };
    value: null;
  };
  table: {
    args: {
      columns: Record<string, Parameters<ColumnHelper<any>['accessor']>[1]>;
      data: object[];
    };
    value: null;
  };
  line_chart: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    args: Parameters<TypedChartComponent<'line'>>[0];
    value: null;
  };
  bar_chart: {
    args: Parameters<TypedChartComponent<'bar'>>[0];
    value: null;
  };
  pie_chart: {
    args: Parameters<TypedChartComponent<'pie'>>[0];
    value: null;
  };
  doughnut_chart: {
    args: Parameters<TypedChartComponent<'doughnut'>>[0];
    value: null;
  };
  radar_chart: {
    args: Parameters<TypedChartComponent<'radar'>>[0];
    value: null;
  };
  scatter_chart: {
    args: Parameters<TypedChartComponent<'scatter'>>[0];
    value: null;
  };

  chat_input: {
    args: { placeholder?: string };
    value: string | null;
  };
  color_picker: AllowDefaultHelper<{
    args: { label?: string };
    value: string;
  }>;
  checkbox: AllowDefaultHelper<{
    args: {
      label: string;
    };
    value: boolean;
  }>;
  toggle: AllowDefaultHelper<{
    args: {
      label: string;
    };
    value: boolean;
  }>;
  radio: AllowDefaultHelper<{
    args: {
      options: string[];
      label: string;
    };
    value: string;
  }>;
  text_input: AllowDefaultHelper<{
    args: {
      label: string;
      placeholder?: string;
    };
    value: string;
  }>;
  file_upload: {
    args: {
      label: string;
    } & Omit<DropzoneOptions, 'onUpload'>;
    value: formidable.File[];
  };
  video: {
    args: HTMLProps<HTMLVideoElement>;
    value: null;
  };
  loading_spinner: {
    args: {
      fontSize: number;
      top?: number;
      left?: number;
    };
    value: null;
  };
  // date_input: AllowDefaultHelper<{}>
};
export type ComponentPropsMapping = {
  [key in keyof _ComponentBasePropsMapping]: {
    args: _ComponentBasePropsMapping[key]['args'];
    value: _ComponentBasePropsMapping[key]['value'];
    id: string;
  };
};
type ContainerArgsMapping = {
  base: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    args: {};
  };
  columns: {
    args: { columns: number | number[] };
  };
  sidebar: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    args: {};
  };
  page: {
    args: { path: string };
  };
  collapse: {
    args: {
      label: string;
    };
  };
  tabs: {
    args: {
      labels: string[];
    };
  };
  chat_message: {
    args: {
      by: string;
      avatar?: string;
      avatarPlacement?: 'left' | 'right';
      loadingPromise?: Promise<string>;
    };
  };
};
export type ManagerArgsMapping = {
  chat_manager: {
    args: {
      messages: (ContainerArgsMapping['chat_message']['args'] & {
        content: string | Promise<string>;
      })[];
    };
  };
};
export type InbuiltComponentTypes = keyof ComponentPropsMapping;
export type InbuiltContainerTypes = keyof ContainerArgsMapping;
export type ContainerPropsMapping = {
  [key in InbuiltContainerTypes]: ContainerArgsMapping[key] & {
    children: BackroadContainer<InbuiltContainerTypes>['children'];
  };
};

export type InbuiltNodeTypes = InbuiltComponentTypes | InbuiltContainerTypes;

export type BackroadComponent<
  Type extends InbuiltComponentTypes,
  ValuePopulated extends boolean = false
> = {
  args: //  Type extends InbuiltComponentTypes?
  ComponentPropsMapping[Type]['args'];
  type: Type;
  path: string;
  id: string;
} & (ValuePopulated extends true
  ? {
      value: ComponentPropsMapping[Type]['value'];
    }
  : // eslint-disable-next-line @typescript-eslint/ban-types
    {});
export interface BackroadContainer<
  Type extends InbuiltContainerTypes,
  ChildrenValuePopulated extends boolean = false
> {
  children: BackroadNode<false, ChildrenValuePopulated>[];
  args: Type extends InbuiltContainerTypes
    ? ContainerArgsMapping[Type]['args']
    : object;
  type: Type;
  path: string;
}

export type GenericBackroadComponent<ValuePopulated extends boolean = false> =
  BackroadComponent<InbuiltComponentTypes, ValuePopulated>;
// &
//   (ValuePopulated extends true
//     ? { value: unknown }
//     : // eslint-disable-next-line @typescript-eslint/ban-types
//       {});
export type GenericBackroadContainer<
  ChildrenValuePopulated extends boolean = false
> = BackroadContainer<InbuiltContainerTypes, ChildrenValuePopulated>;
export type BackroadNode<
  ValuePopulated extends boolean = false,
  ChildrenValuePopulated extends boolean = false
> =
  | GenericBackroadComponent<ValuePopulated>
  | GenericBackroadContainer<ChildrenValuePopulated>;
// Type extends InbuiltComponentTypes
//   ? BackroadComponent<Type>
//   : Type extends InbuiltContainerTypes
//   ? BackroadContainer<Type>
//   : {
//       path: string;
//       type: string;
//       id?: string;
//     };

export function isBackroadComponent<ValuePopulated extends boolean>(
  element: BackroadNode,
  valuePopulated: ValuePopulated
): element is GenericBackroadComponent<ValuePopulated> {
  return (
    !('children' in element) &&
    (valuePopulated ? 'value' in element : !('value' in element))
  );
}

// if no default is provided, null will be supplied (by default) by setter
export const defaultValueFallbacks: {
  [key in InbuiltComponentTypes]?:
    | ComponentPropsMapping[key]['value']
    | ((props: {
        args: ComponentPropsMapping[key]['args'];
      }) => ComponentPropsMapping[key]['value']);
} = {
  chat_input: null,
  button: false,
  color_picker: '#000000',
  checkbox: false,
  toggle: false,
  radio: (props) => props.args.options[0],
  text_input: '',
  file_upload: [],
};
