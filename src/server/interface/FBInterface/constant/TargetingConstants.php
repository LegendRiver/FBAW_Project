<?php

/**
 * Created by IntelliJ IDEA.
 * User: yuanyuan
 * Date: 16/8/17
 * Time: 下午1:14
 */
class TargetingConstants
{
    const COUNTRY_COUNT_LIMIT = 25;
    const REGION_COUNT_LIMIT = 200;
    const CITY_COUNT_LIMIT = 250;
    const CITY_RADIUS_MIN_MILE_LIMIT = 10;
    const CITY_RADIUS_MAX_MILE_LIMIT = 50;
    const CITY_RADIUS_MIN_KILOMETER_LIMIT = 17;
    const CITY_RADIUS_MAX_KILOMETER_LIMIT = 80;
    const ZIPS_COUNT_LIMIT = 2500;
    const CUSTOM_LOCATION_COUNT_LIMIT = 200;
    const CUSTOM_LOCATION_MIN_MILE_LIMIT = 0.62;
    const CUSTOM_LOCATION_MAX_MILE_LIMIT = 50;
    const CUSTOM_LOCATION_MIN_KILOMETER_LIMIT = 1;
    const CUSTOM_LOCATION_MAX_KILOMETER_LIMIT = 80;
    const GEO_MARKET_COUNT_LIMIT = 2500;
    const LOCALE_LUANGUE_COUNT_LIMIT = 50;

    const LOCATION_TYPE_HOME = 'home';
    const LOCATION_TYPE_RECENT = 'recent';
    const LOCATION_TYPE_TRAVELIN = 'travel_in';

    const GENDER_MALE = 1;
    const GENDER_FEMALE = 2;

    const AGE_MAX_LIMIT = 65;
    const AGE_MIN_LIMIT = 13;
    const AGE_MIN_DEFAULT = 18;
    const AGE_MAX_DEFAULT = 65;

    const USER_OS_IOS = 'iOS';
    const USER_OS_ANDROID = 'Android';

    const WIRELESS_CARRIER = 'Wifi';

    const DEVICE_PLATFORM_MOBILE = 'mobile';
    const DEVICE_PLATFORM_DESKTOP = 'desktop';

    const PUBLISHER_PLATFORM_FACEBOOK = 'facebook';
    const PUBLISHER_PLATFORM_INSTAGRAM = 'instagram';
    const PUBLISHER_PLATFORM_AUDIENCENETWORK = 'audience_network';

    const FACEBOOK_POSITION_FEED = 'feed';
    const FACEBOOK_POSITION_RIGHTHAND = 'right_hand_column';

    const RELATIONSHIP_STATUSE_SINGLE = 1;
    const RELATIONSHIP_STATUSE_IN_RELATIONSHIP = 2;
    const RELATIONSHIP_STATUSE_MARRIED = 3;
    const RELATIONSHIP_STATUSE_ENGAGED = 4;
    const RELATIONSHIP_STATUSE_NOT_SPECIFIED = 6;
    const RELATIONSHIP_STATUSE_CIVILUNION = 7;
    const RELATIONSHIP_STATUSE_DOMESTIC_PARTNERSHIP = 8;
    const RELATIONSHIP_STATUSE_OPEN_RELATIONSHIP = 9;
    const RELATIONSHIP_STATUSE_COMPLICATED = 10;
    const RELATIONSHIP_STATUSE_SEPARATED = 11;
    const RELATIONSHIP_STATUSE_DIVORCED = 12;
    const RELATIONSHIP_STATUSE_WIDOWED = 13;

    const INTERESTED_IN_MEN = 1;
    const INTERESTED_IN_WOMEN = 2;
    const INTERESTED_IN_MEN_WOMEN = 3;
    const INTERESTED_IN_NOT_SEPC = 4;

    const EDUCATION_STATUSES_HIGH_SCHOOL = 1;
    const EDUCATION_STATUSES_UNDERGRAD = 2;
    const EDUCATION_STATUSES_ALUM = 3;
    const EDUCATION_STATUSES_HIGH_SCHOOL_GRAD = 4;
    const EDUCATION_STATUSES_SOME_COLLEGE = 5;
    const EDUCATION_STATUSES_ASSOCIATE_DEGREE =6;
    const EDUCATION_STATUSES_IN_GRAD_SCHOOL = 7;
    const EDUCATION_STATUSES_SOME_GRAD_SCHOOL = 8;
    const EDUCATION_STATUSES_MASTER_DEGREE = 9;
    const EDUCATION_STATUSES_PROFESSIONAL_DEGREE = 10;
    const EDUCATION_STATUSES_DOCTORATE_DEGREE = 11;
    const EDUCATION_STATUSES_UNSPECIFIED = 12;
    const EDUCATION_STATUSES_SOME_HIGH_SCHOOL = 13;

    const COLLEGE_YEAR_MIN_LIMIT = 1980;

    const EDUCATION_MAJOR_COUNT_LIMIT = 200;

    const WORK_EMPLOYER_COUNT_LIMIT = 200;

    const WORK_POSITION_COUNT_LIMIT = 200;

    const LOCALE_SEARCH_KEY = 'key';
    const LOCALE_SEARCH_NAME = 'name';
    const APPLICATION_SEARCH_TYPE = 'addestination';
    const APPLICATION_SEARCH_PARA_URL = 'object_url';
    const APPLICATION_SEARCH_ID = 'id';
    const APPLICATION_SEARCH_NAME = 'name';
    const APPLICATION_SEARCH_ORIGINURL = 'original_object_url';
    const APPLICATION_SEARCH_STOREURL = 'object_store_url';
    const APPLICATION_SEARCH_PICTURE = 'picture';
    const APPLICATION_SEARCH_DESCRIPTION = 'description';
    const APPLICATION_SEARCH_SUPPORTDEVICE = 'supported_devices';

    const TARGETING_SEARCH_LIMIT = 'limit';

    const COUNTRY_SEARCH_PARAM = 'country';
    const CITY_SEARCH_PARAM = 'city';
    const REGION_SEARCH_PARAM = 'region';
    const COUNTRY_SEARCH_KEY = 'key';
    const COUNTRY_SEARCH_NAME = 'name';
    const COUNTRY_SEARCH_COUNTRY_CODE = 'country_code';
    const COUNTRY_SEARCH_TYPE = 'type';

    const TARGETING_SEARCH_PLATFORM = 'platform';

    const SEARCH_CLASS_INTEREST = 'interests';
    const SEARCH_CLASS_BEHAVIOR = 'behaviors';
    const SEARCH_CLASS_DEMOGRAPHIC = 'demographics';
    const SEARCH_CLASS_LIFE_EVENT = 'life_events';
    const SEARCH_CLASS_POLITICS = 'politics';
    const SEARCH_CLASS_INDUSTRY = 'industries';
    const SEARCH_CLASS_INCOME = 'income';
    const SEARCH_CLASS_NET_WORTH = 'net_worth';
    const SEARCH_CLASS_HOME_TYPE = 'home_type';
    const SEARCH_CLASS_HOME_OWNERSHIP = 'home_ownership';
    const SEARCH_CLASS_ETHNIC_AFFINITY = 'ethnic_affinity';
    const SEARCH_CLASS_GENERATION = 'generation';
    const SEARCH_CLASS_HOUSEHOLD_COMPOSITION = 'household_composition';
    const SEARCH_CLASS_MOMS = 'moms';
    const SEARCH_CLASS_OFFICE_TYPE = 'office_type';
    const SEARCH_CLASS_FAMILY_STATUSES = 'family_statuses';
    const SEARCH_CLASS_USER_DEVICE = 'user_device';
    const SEARCH_CLASS_USER_OS = 'user_os';

    const P_SEARCH_CLASS_RELATIONSHIP_STATUS = 'relationship_status';
    const P_SEARCH_CLASS_EDUCATION_STATUS = 'education_status';

    const TARGETING_COMMON_ID = 'id';
}
