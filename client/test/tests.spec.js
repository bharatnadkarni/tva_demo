import { mount, shallowMount } from '@vue/test-utils'
import flushPromises from "flush-promises";
import ChartView from '@/components/ChartView.vue'
import MagnitudeList from '@/components/MagnitudeList'
import MagnitudeSquare from '@/components/MagnitudeSquare'
import HomePage from '@/pages/index.vue'

jest.setTimeout(10000)

describe('ChartView', () => {

  test('ChartView loads correctly', () => {
    const wrapper = shallowMount(ChartView, {
      propsData: {
        structuredData: [],
        xRange: 0,
        yRange: 0
      },
    });
    expect(wrapper.vm).toBeTruthy()
  })

  test('MagnitudeList loads correctly', () => {
    const wrapper = shallowMount(MagnitudeList, {
      propsData: {
        magnitudeData: [],
        magnitudeMax: 0,
        day: 0
      },
    });
    expect(wrapper.vm).toBeTruthy()
  })

  test('MagnitudeSquare loads correctly', () => {
    const wrapper = shallowMount(MagnitudeSquare, {
      propsData: {
        day: 0,
        index: 0,
        value: 0,
        max: 0
      },
    });
    expect(wrapper.vm).toBeTruthy()
  })

  test('Index page loads correctly', async () => {
    const wrapper = mount(HomePage, {
      mocks: {
        $vuetify: { breakpoint: {} },
        $axios: {
          get: jest.fn().mockResolvedValue(Promise.resolve({}))
        },
        $refs: {
          chart: {
            offsetWidth: 0
          }
        }
      }
    });
    await wrapper.setData({
      loading: false,
      structuredData: [],
      magnitudeData: [],
      magnitudeMax: null,
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      selected_day: 0,
      xRange: 0,
      yRange: 0,
    });
    expect(wrapper.vm).toBeTruthy()
  }, 50000)

})
