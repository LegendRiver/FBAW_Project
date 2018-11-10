__d('AdsPredictedOutcomesBar.react', ['cssVar', 'fbt', 'AdsHelpLink.react', 'LeftRight.react', 'React', 'SpectrumIntegerScale', 'InsightsCSSBar.react', 'SUIText.react', 'intlNumUtils'],
    (
        function a(b, c, d, e, f, g, h, i) {
            'use strict';
            var j, k, l = c('React').PropTypes, m = function o(p) {
                return c('intlNumUtils').formatNumberWithThousandDelimiters(p, 0);
            };
            j = babelHelpers.inherits(n, c('React').PureComponent);
            k = j && j.prototype;
            n.prototype.render = function () {
                var o = this.props, p = o.className, q = o.maximumValue, r = o.numberFormatter,
                    s = o.predictedMax, t = o.predictedMin, u = o.title, v = Math.max(s, q), w = Math.sqrt(v), x = Math.max(.05 * w, Math.sqrt(s));
                return (
                    c('React').createElement(
                        'div', {className: p}, c('React').createElement(
                            c('SUIText.react'), {size: 'small', weight: 'bold'}, u),
                        c('React').createElement(
                            c('LeftRight.react'), null, c('React').createElement(
                                'div', null, i._(
                                    "{Range of predicted out comes, e.g. 100 - 200} {Max predicted outcomes, e.g. (of 1000)}",
                                    [i.param(
                                        'Range of predicted out comes, e.g. 100 - 200', c('React').createElement(
                                            c('SUIText.react'), {size: 'small'}, i._(
                                                "{lower bound of range} - {upper bound of range}",
                                                [i.param('lower bound of range', r(t)), i.param('upper bound of range', r(s))]
                                            )
                                        )),
                                        i.param(
                                            'Max predicted outcomes, e.g. (of 1000)', c('React').createElement(
                                                c('SUIText.react'), {shade: 'light', size: 'small'}, i._(
                                                    "(of {maximum value})", [i.param('maximumvalue', r(v))]
                                                )
                                            )
                                        )
                                    ])),
                            c('React').createElement(
                                'div', null, c('React').createElement(
                                    c('AdsHelpLink.react'), {position: 'left', width: 300}, this.props.tooltip))
                        ), c('React').createElement(c('InsightsCSSBar.react'), {
                            colors: ["#54C7EC", "#e9ebee"],
                            scale: c('SpectrumIntegerScale')().domain([0, w]),
                            values: [x, w - x]
                        })));
            };
            function n() {
                j.apply(this, arguments);
            }

            n.propTypes = {
                className: l.string,
                maximumValue: l.number.isRequired,
                numberFormatter: l.func,
                predictedMax: l.number.isRequired,
                predictedMin: l.number.isRequired,
                title: l.node.isRequired,
                tooltip: l.node.isRequired
            };
            n.defaultProps = {className: '', numberFormatter: m};
            f.exports = n;
        }), null);

__d('AdsPredictedOutcomes.react', ['cx', 'fbt', 'AdsBisonUtils', 'AdsWebdriverIDs', 'AdsOptimizationGoalStrings', 'AdsOutcomePredictionSurvey.react', 'AdsPredictedOutcomesBar.react', 'AdsPredictedOutcomesPlacementUpsell.react', 'AdsReachEstimateStrings', 'BUIAdoptionXUIGrayText.react', 'React', 'SUIBusinessTheme', 'SUIThemeContainer.react', 'ads-lib-formatters'], (
    function a(b, c, d, e, f, g, h, i) {
        'use strict';
        var j, k, l = c('React').PropTypes, m = c('ads-lib-formatters').createLimitedSigFigNumberFormatter(0, 2),
            n = 10;
        j = babelHelpers.inherits(o, c('React').PureComponent);
        k = j && j.prototype;
        o.prototype.render = function () {
            var p = this.props, q = p.estimateDAU, r = p.estimatedCVR, s = p.isCanvasPromotedObject, t = p.objective,
                u = p.optimizationGoal, v = p.predictions, w = p.placementUpsellData,
                x = p.promotedObjectType, y = p.showActions, z = p.showPlacementUpsell,
                aa = p.showSurvey, ba = null;
            if (q && v.reach) {
                var ca = c('AdsBisonUtils').getReachEstimateBounds(v.reach, q);
                ba = c('React').createElement(c('AdsPredictedOutcomesBar.react'), {
                    className: "_3-97",
                    maximumValue: q,
                    numberFormatter: m,
                    predictedMax: ca.max,
                    predictedMin: ca.min,
                    title: c('AdsReachEstimateStrings').DAILY_REACH,
                    tooltip: c('AdsReachEstimateStrings').DAILY_REACH_EXPLANATION
                });
            }
            var da = null, ea = q * r, fa = c('AdsBisonUtils').shouldShowActions(u);
            if (ea && v.actions && v.actions >= n && v.actions < v.reach && y && fa) {
                var ga = c('AdsOptimizationGoalStrings').getTitle(u, t, x, s), ha = i._("This is the number of {Optimization Goal, e.g. Link Clicks} that we estimate you can get, out of the total number of {Optimization Goal, e.g. Link Clicks} that we estimate it's possible to get, based on your campaign performance and estimated daily reach.", [i.param('Optimization Goal, e.g. Link Clicks', ga)]),
                    ia = c('AdsBisonUtils').getReachEstimateBounds(v.actions);
                da = c('React').createElement(c('AdsPredictedOutcomesBar.react'), {
                    className: "_3-95",
                    maximumValue: ea,
                    numberFormatter: m,
                    predictedMax: ia.max,
                    predictedMin: ia.min,
                    title: ga,
                    tooltip: ha
                });
                if (w && z)da = c('React').createElement('div', null, da, c('React').createElement(c('AdsPredictedOutcomesPlacementUpsell.react'), {
                    missingPlatforms: w.missingPlatforms,
                    optimizationGoalName: ga,
                    predictions: v,
                    upsellPredictions: w.upsellPredictions
                }));
            }
            var ja = aa ? c('React').createElement(c('AdsOutcomePredictionSurvey.react'), null) : null;
            if (ba || da) {
                return (c('React').createElement(c('SUIThemeContainer.react'), {theme: c('SUIBusinessTheme')}, c('React').createElement('div', {'data-testid': c('AdsWebdriverIDs').PREDICTED_OUTCOMES}, ba, c('React').createElement('div', {className: "_3-97"}, da), c('React').createElement(c('BUIAdoptionXUIGrayText.react'), {
                    shade: 'light',
                    size: 'small'
                }, c('AdsReachEstimateStrings').DISCLAIMER), c('React').createElement('div', null, ja))));
            } else return this.$AdsPredictedOutcomes1();
        };
        o.prototype.$AdsPredictedOutcomes1 = function () {
            return (c('React').createElement('div', null, i._("Predicted outcomes are currently unavailable")));
        };
        function o() {
            j.apply(this, arguments);
        }

        o.propTypes = {
            estimateDAU: l.number.isRequired,
            estimatedCVR: l.number.isRequired,
            isCanvasPromotedObject: l.bool,
            objective: l.string,
            optimizationGoal: l.string.isRequired,
            placementUpsellData: l.object,
            predictions: l.object.isRequired,
            promotedObjectType: l.string,
            showActions: l.bool,
            showPlacementUpsell: l.bool,
            showSurvey: l.bool.isRequired
        };
        f.exports = o;
    }), null);

__d('AdsReachEstimateStrings', ['fbt'], (function a(b, c, d, e, f, g, h) {
    'use strict';
    var i = {
        ESTIMATE_FACEBOOK_DAU_EXPLANATION: h._("This is the total number of people in your selected audience who are active on Facebook each day."),
        ESTIMATE_INSTAGRAM_DAU_EXPLANATION: h._("The potential reach is an estimation based on an approximation of the audience eligible to see your ads on Instagram and several other factors."),
        DAILY_REACH_EXPLANATION: h._("This is the number of people we estimate you'll reach in your audience, out of the the total number of people in your audience who are active on the selected platforms each day. This has to do with factors like your bid and budget."),
        DAILY_REACH: h._("Reach"),
        DISCLAIMER: h._("This is only an estimate. Numbers shown are based on your past campaign performance, but don't guarantee results."),
        PREDICTED_OUTCOMES: h._("Estimated Daily Results")
    };
    f.exports = i;
}), null);

__d('AdsBisonUtils', ['AdsAPIOptimizationGoals', 'AdsOptimizationGoalsWithPredictedActions', 'BinarySearch', 'BisonConsts', 'JSLog'],
    (function a(b, c, d, e, f, g) {
        'use strict';
        var h = .45, i = .98, j = {
            parseApiCurveString: function k(l) {
                var m = [],
                    n = l.split(';'),
                    o = c('BisonConsts').ApiCurveFieldNames,
                    p = o.length,
                    q = true;
                for (var r = 0; r < n.length; r++) {
                    var s = n[r], t = s.split(':');
                    if (t.length !== p) {
                        q = false;
                        break;
                    }
                    var u = {};
                    for (var v = 0; v < p; v++)u[o[v]] = Number(t[v]);
                    m.push(u);
                }
                return q ? m : [];
            }, parseReachEstimateCurve: function k(l, m) {
                var n = l.map(function (o) {
                    return {
                        actions: o.action_median,
                        bid: o.bid,
                        impressions: o.imp_median,
                        reach: o.reach_median * m / 100,
                        spend: o.spend_median
                    };
                });
                return n;
            }, getCurveString: function k(l, m) {
                var n = void 0;
                switch (l) {
                    case c('AdsAPIOptimizationGoals').CLICKS:
                        n = m.cpc_curve_data;
                        break;
                    case c('AdsAPIOptimizationGoals').IMPRESSIONS:
                    case c('AdsAPIOptimizationGoals').REACH:
                        n = m.cpm_curve_data;
                        break;
                    default:
                        n = m.cpa_curve_data;
                }
                return n || '';
            }, getReachEstimateByBudget: function k(l, m, n, o) {
                var p = this.getEmptyPoint();
                if (m <= 0)return p;
                if (!l || l.length === 0)return p;
                if (o || !n)n = Number.MAX_SAFE_INTEGER;
                var q;
                for (q = 0; q < l.length; q++)if (l[q].spend > m || n && l[q].bid > n)break;
                if (q === 0) {
                    var r = l[0], s = m / r.spend;
                    if (n)s = Math.min(s, n / r.bid);
                    var t = s * r.spend;
                    return this.interpolatePointFromSpend(t, p, r);
                }
                if (q === l.length)return l[l.length - 1];
                var u = l[q - 1], v = l[q], w = (m - u.spend) / (v.spend - u.spend);
                if (n)w = Math.min(w, (n - u.bid) / (v.bid - u.bid));
                var x = u.spend + w * (v.spend - u.spend);
                return this.interpolatePointFromSpend(x, u, v);
            }, getReachEstimateByBudget_DEPRECATED: function k(l, m, n, o) {
                var p = j.parseReachEstimateCurve(l, m);
                return j.getReachEstimateByBudget(p, n, o, !o);
            }, getReachEstimateBounds: function k(l) {
                var m = arguments.length <= 1 || arguments[1] === undefined ? Number.MAX_SAFE_INTEGER : arguments[1],
                    n = Math.min(l * (1 - h), i * m),
                    o = Math.min(l * (1 + h), m);
                return {min: n, max: o};
            }, getBudgetIsSupported: function k(l, m) {
                var n = arguments.length <= 2 || arguments[2] === undefined ? Number.MAX_SAFE_INTEGER : arguments[2];
                if (l.length === 0)return false;
                var o = l[l.length - 1];
                return (o.spend > m || o.bid > n);
            }, getPointFromSpend: function k(l, m) {
                var n = j.getEmptyPoint();
                n.spend = l;
                var o = c('BinarySearch').findBoundInArray(m, n, function (r, s) {
                    return r.spend - s.spend;
                }, c('BinarySearch').LEAST_UPPER_BOUND);
                if (o >= m.length)return m[m.length - 1];
                var p = o === 0 ? j.getEmptyPoint() : m[o - 1], q = m[o];
                return j.interpolatePointFromSpend(l, p, q);
            }, interpolatePointFromSpend: function k(l, m, n) {
                var o = function p(q) {
                    var r = (n[q] - m[q]) / (n.spend - m.spend);
                    return m[q] + r * (l - m.spend);
                };
                return {
                    actions: o('actions'),
                    bid: o('bid'),
                    impressions: o('impressions'),
                    reach: o('reach'),
                    spend: o('spend')
                };
            }, getPointPredictionForCampaign: function k(l, m, n) {
                var o = l.estimate_DAU || 0, p = n.optimization_goal, q = j.getCurveString(p, l);
                return j.getReachEstimateByBudget_DEPRECATED(j.parseApiCurveString(q), o, m, n.is_autobid ? undefined : n.bid_amount);
            }, getLastPointPredictionForCampaign: function k(l, m) {
                var n = l.estimate_DAU || 0,
                    o = m.optimization_goal,
                    p = j.getCurveString(o, l),
                    q = j.parseApiCurveString(p),
                    r = this.getEmptyPoint(),
                    s = j.parseReachEstimateCurve(q, n);
                if (!s || s.length === 0)return r;
                return s[s.length - 1];
            }, getEmptyPoint: function k() {
                return {actions: 0, bid: 0, impressions: 0, reach: 0, spend: 0};
            }, getEstimatedCVR: function k(l, m) {
                if (m === 0)return 0;
                return l / m;
            }, shouldShowActions: function k(l) {
                return l in c('AdsOptimizationGoalsWithPredictedActions');
            }
        };
        f.exports = j;
    }), null);

__d('AdsReachEstimate.react', ['ix', 'cx', 'fbt', 'invariant', 'AdsOutcomePredictionSurvey.react', 'AdsReachEstimateBar.react', 'AdsReachEstimatePlatformConstant', 'AdsReachEstimateStrings', 'AdsWebdriverIDs', 'BUIAdoptionXUIGrayText.react', 'Image.react', 'ImageBlock.react', 'InlineBlock.react', 'React', 'ReactComponentWithPureRenderMixin', 'adsGKCheck', 'fbglyph'],
    (function a(b, c, d, e, f, g, h, i, j, k) {
        'use strict';
        var l = c('React').PropTypes, m = l.shape({
            audienceSize: l.number.isRequired,
            reachBounds: l.shape({max: l.number.isRequired, min: l.number.isRequired}).isRequired
        }), n = c('React').createClass({
            displayName: 'AdsReachEstimate',
            mixin: [c('ReactComponentWithPureRenderMixin')],
            propTypes: {
                facebookReachEstimateData: m,
                instagramReachEstimateData: m,
                isReachLow: l.bool,
                showSurvey: l.bool
            },
            render: function o() {
                var p = this.props, q = p.facebookReachEstimateData, r = p.instagramReachEstimateData, s = p.showSurvey;
                q || r || k(0);
                var t = void 0, u = void 0;
                if (q)t = c('React').createElement(c('AdsReachEstimateBar.react'), {
                    estimateDAU: q.audienceSize,
                    explanationMessage: c('AdsReachEstimateStrings').ESTIMATE_FACEBOOK_DAU_EXPLANATION,
                    reachBounds: q.reachBounds
                });
                if (r)u = c('React').createElement(c('AdsReachEstimateBar.react'), {
                    estimateDAU: r.audienceSize,
                    explanationMessage: c('AdsReachEstimateStrings').ESTIMATE_INSTAGRAM_DAU_EXPLANATION,
                    platform: c('AdsReachEstimatePlatformConstant').INSTAGRAM,
                    reachBounds: r.reachBounds
                });
                var v = s ? c('React').createElement(c('AdsOutcomePredictionSurvey.react'), null) : null;
                return (c('React').createElement('div', {'data-testid': c('AdsWebdriverIDs').PREDICTED_OUTCOMES}, t, u, this._renderLowReachWarning(), c('React').createElement(c('BUIAdoptionXUIGrayText.react'), {
                    className: "_3-8y",
                    display: 'block',
                    shade: 'medium'
                }, j._(["This is only an estimate. Numbers shown are based on the average performance of ads targeted to your selected audience.", "ac0fbf174fb491ba121ddaf693ae8812"])), c('React').createElement('div', null, v)));
            },
            _renderLowReachWarning: function o() {
                if (c('adsGKCheck')('ads_placement_v2_ui') && this.props.isReachLow)return (c('React').createElement(c('ImageBlock.react'), {className: "_3-8x"}, c('React').createElement(c('Image.react'), {
                    className: "_3-92",
                    src: h("images\/assets_DO_NOT_HARDCODE\/fb_glyphs\/caution-solid_24_fig-light-30.png")
                }), c('React').createElement(c('InlineBlock.react'), null, c('React').createElement(c('BUIAdoptionXUIGrayText.react'), {shade: 'medium'}, j._("Your placements are very limited. Your ad may not reach as many people as you'd like, and you may not meet your goals. Try increasing your reach by adding placements.")))));
                return null;
            }
        });
        f.exports = n;
    }), null);

__d('AdsCampaignReachEstimate.react', ['fbt', 'AdsAPIBidInfoFields', 'AdsAPIObjectives', 'AdsAPIOptimizationGoals', 'AdsAPIPublisherPlatform', 'AdsAPIReachEstimateFields', 'AdsAPITargetFields', 'AdsBidUtils', 'AdsBisonUtils', 'AdsBulkInstagramApplicabilityUtils', 'AdsBulkValue', 'AdsBulkValueUtils', 'AdsOtherConsts', 'AdsPredictedOutcomes.react', 'AdsPredictedOutcomesPlacementUpsellUtils', 'AdsQE', 'AdsReachEstimate.react', 'AdsReachEstimateLogger', 'AdsReachEstimateUtils', 'AdsTargetingLocationUtils', 'BUIAdoptionXUISpinner.react', 'LoadObject', 'React', 'adsGKCheck', 'filterObject', 'isValidTargetingSpec'],
    (function a(b, c, d, e, f, g, h) {
        'use strict';
        var i, j, k = c('React').PropTypes, l = h._("Set your targeting to see the estimated daily reach for this ad set."), m = h._("Add a location for your audience to see an estimated number of people you might reach."), n = h._("Set the optimization and pricing to see the estimated daily reach for this ad set."), o = h._("Set the end date to see the estimated daily reach for this ad set."), p = h._("Set your budget to see the estimated daily reach for this ad set."), q = h._("The estimated daily reach is currently unavailable."), r = h._("Objective must be set and must be unique across selected ad sets."), s = h._("Targeting must be set and must be unique across selected ad sets."), t = {
            errorMessage: null,
            estimateDAU: 0,
            estimatedCVR: 0,
            facebookReachEstimateData: null,
            instagramReachEstimateData: null,
            isLoading: false,
            overallPredictionData: null,
            shouldShowPlacementUpsell: false,
            shouldShowPredictedActions: false,
            shouldShowRedesignedOutcomes: false,
            upsellPredictionData: null,
            usersCount: 0
        };
        i = babelHelpers.inherits(u, c('React').PureComponent);
        j = i && i.prototype;
        function u(v) {
            j.constructor.call(this, v);
            this.state = this.$AdsCampaignReachEstimate1(this.props);
        }

        u.prototype.componentWillReceiveProps = function (v) {
            this.setState(this.$AdsCampaignReachEstimate1(v));
        };
        u.prototype.$AdsCampaignReachEstimate1 = function (v) {
            var w = v.id.getValues().length,
                x = c('AdsBulkValueUtils').getUniformValueDeep(v.targetingSpecs, w),
                y = c('AdsBulkValueUtils').getUniformValue(v.objective),
                z = v.dailyBudget,
                aa = c('AdsBulkValueUtils').getUniformValue(v.lifetimeBudget), ba = c('AdsBulkValueUtils').getUniformValue(v.endTime), ca = void 0, da = c('AdsBulkValueUtils').getUniformValueDeep(v.promotedObject, w), ea = c('AdsBulkValueUtils').getUniformValue(v.id), fa = c('AdsBulkValueUtils').getUniformValue(v.isNew, true);
            if (!y) {
                ca = r;
                return babelHelpers['extends']({}, t, {errorMessage: ca});
            }
            if (y === c('AdsAPIObjectives').LOCAL_AWARENESS)if (!x || !c('AdsTargetingLocationUtils').getLocationsCount(x[c('AdsAPITargetFields').GEO_LOCATIONS])) {
                ca = m;
                return babelHelpers['extends']({}, t, {errorMessage: ca});
            }
            if (!x) {
                ca = w > 1 ? s : l;
                return babelHelpers['extends']({}, t, {errorMessage: ca});
            }
            if (!c('isValidTargetingSpec')(x)) {
                ca = c('isValidTargetingSpec').errorMessage;
                return babelHelpers['extends']({}, t, {errorMessage: ca});
            }
            if (!this.$AdsCampaignReachEstimate2(v)) {
                ca = n;
                return babelHelpers['extends']({}, t, {errorMessage: ca});
            }
            if (aa && !ba) {
                ca = o;
                return babelHelpers['extends']({}, t, {errorMessage: ca});
            }
            if (!z) {
                ca = p;
                return babelHelpers['extends']({}, t, {errorMessage: ca});
            }
            x = c('filterObject')(x, function (ma) {
                return ma !== null && ma !== undefined;
            });
            if (Object.keys(x).length === 0) {
                ca = l;
                return babelHelpers['extends']({}, t, {errorMessage: ca});
            }
            var ga = this.$AdsCampaignReachEstimate3(v),
                ha = c('AdsBulkInstagramApplicabilityUtils').allTargetingSpecsHaveInstagramPlacementOnly(v.targetingSpecs),
                ia = c('AdsBulkInstagramApplicabilityUtils').someTargetingSpecsHaveInstagramPlacement(v.targetingSpecs),
                ja = c('AdsPredictedOutcomesPlacementUpsellUtils').getShouldShowRedesign(v.redesignedReachPredictionsQE),
                ka = c('AdsPredictedOutcomesPlacementUpsellUtils').getShouldShowUpsell(v.redesignedReachPredictionsQE),
                la = c('AdsPredictedOutcomesPlacementUpsellUtils').getShouldShowActions(v.redesignedReachPredictionsQE);
            return this.$AdsCampaignReachEstimate4(ea, v.accountID, v.currency, x, ga, z, y, ha, ia, da, fa, ja, ka, la);
        };
        u.prototype.$AdsCampaignReachEstimate4 = function (v, w, x, y, z, aa, ba, ca, da, ea, fa, ga, ha, ia) {
            var ja = void 0, ka = void 0, la = void 0, ma = void 0, na = void 0, oa = void 0,
                pa = void 0, qa = 0, ra = 0, sa = 0;
            if (ga) {
                na = this.props.overallPrediction;
                if (!na || na.hasError())return babelHelpers['extends']({}, t, {errorMessage: q});
            } else {
                if (!ca) {
                    ja = this.props.facebookReachEstimate;
                    if (!ja || ja.hasError()) {
                        return babelHelpers['extends']({}, t, {errorMessage: q});
                    } else if (ja.hasValue())qa = c('AdsReachEstimateUtils').getUsers(ja);
                }
                if (da) {
                    la = this.props.instagramReachEstimate;
                    if (!la || la.hasError())return babelHelpers['extends']({}, t, {errorMessage: q});
                    if (ca && la && la.hasValue())qa = c('AdsReachEstimateUtils').getUsers(la);
                }
            }
            if (ja && (ja.isLoading() || !ja.hasValue()) || la && (la.isLoading() || !la.hasValue()) || na && (na.isLoading() || !na.hasValue()))return babelHelpers['extends']({}, t, {isLoading: true});
            if (ja && ja.hasValue()) {
                var ta = ja.getValueEnforcing();
                qa = ta.users || 0;
                ka = this.$AdsCampaignReachEstimate5(z, aa, ta);
            }
            if (la && la.hasValue()) {
                var ua = la.getValueEnforcing();
                ma = this.$AdsCampaignReachEstimate5(z, aa, ua);
                if (ca && ga)qa = ua.users || 0;
            }
            var va = {
                bid_amount: z.bidAmount,
                billing_event: c('AdsBulkValueUtils').getUniformValue(this.props.billingEvent),
                is_autobid: z.isAutoBid,
                optimization_goal: z.optimizationGoal
            };
            if (na && na.hasValue()) {
                var wa = c('AdsReachEstimateUtils').getBidEstimation(na);
                if (wa && na.getValueEnforcing().curve) {
                    oa = c('AdsBisonUtils').getReachEstimateByBudget(na.getValueEnforcing().curve, aa, z.bidAmount, z.isAutoBid);
                    pa = wa.trace_id;
                    var xa = c('AdsBisonUtils').getLastPointPredictionForCampaign(wa, va);
                    ra = wa.estimate_DAU;
                    sa = c('AdsBisonUtils').getEstimatedCVR(xa.actions, xa.impressions);
                }
            }
            if (!(ka || ma || oa))return babelHelpers['extends']({}, t, {errorMessage: q});
            var ya = void 0, za = this.props.eligibleBidEstimate;
            if (za)ya = c('AdsBisonUtils').getPointPredictionForCampaign(za, aa, va);
            return {
                errorMessage: null,
                estimateDAU: ra,
                estimatedCVR: sa,
                facebookReachEstimateData: ka,
                instagramReachEstimateData: ma,
                isLoading: false,
                overallPredictionData: oa,
                overallPredictionID: pa,
                shouldShowPlacementUpsell: ha,
                shouldShowPredictedActions: ia,
                shouldShowRedesignedOutcomes: ga,
                upsellPredictionData: ya,
                usersCount: qa
            };
        };
        u.prototype.$AdsCampaignReachEstimate5 = function (v, w, x) {
            var y = x[c('AdsAPIReachEstimateFields').BID_ESTIMATIONS];
            if (!y || !y.length)return null;
            var z = y[0], aa = z[c('AdsAPIReachEstimateFields').ESTIMATE_DAU] || 0, ba = x.curve, ca = c('AdsBisonUtils').getReachEstimateByBudget(ba, w, v.bidAmount, v.isAutoBid), da = ca.reach;
            if (!da)return null;
            var ea = c('AdsBisonUtils').getReachEstimateBounds(da, aa);
            return {audienceSize: aa, reachBounds: ea, spend: ca.spend, predictionID: z.trace_id};
        };
        u.prototype.$AdsCampaignReachEstimate3 = function (v) {
            var w = c('AdsBulkValueUtils').getUniformValue(v.isAutoBid, false),
                x = c('AdsBulkValueUtils').getUniformValue(v.optimizationGoal, c('AdsAPIOptimizationGoals').NONE),
                y = c('AdsBulkValueUtils').getUniformValue(v.bidAmount),
                z = c('AdsBidUtils').getBidInfoKeyFromOptimizationGoal(x);
            return {bidAmount: y, bidInfoField: z, isAutoBid: w, optimizationGoal: x};
        };
        u.prototype.$AdsCampaignReachEstimate2 = function (v) {
            var w = c('AdsBulkValueUtils').getUniformValue(v.isAutoBid, false), x = c('AdsBulkValueUtils').getUniformValue(v.optimizationGoal), y = c('AdsBulkValueUtils').getUniformValue(v.billingEvent);
            if (!x || !y)return false;
            var z = c('AdsBulkValueUtils').getUniformValue(v.bidAmount);
            return w || !!z;
        };
        u.prototype.$AdsCampaignReachEstimate6 = function () {
            var v = this.state, w = v.estimateDAU, x = v.overallPredictionData, y = v.overallPredictionID, z = v.shouldShowPlacementUpsell, aa = v.shouldShowPredictedActions, ba = v.shouldShowRedesignedOutcomes, ca = v.upsellPredictionData, da = this.props, ea = da.bidAmount, fa = da.dailyBudget, ga = da.isCanvasPromotedObject, ha = da.objective, ia = da.optimizationGoal, ja = da.promotedObjectType;
            ia = c('AdsBulkValueUtils').getUniformValue(ia);
            ha = c('AdsBulkValueUtils').getUniformValue(ha);
            ja = c('AdsBulkValueUtils').getUniformValue(ja);
            var ka = c('AdsBulkValueUtils').getUniformValue(ea, 0), la = void 0;
            if (z)la = {
                missingPlatforms: this.props.missingPlatforms,
                upsellPredictions: ca || c('AdsBisonUtils').getEmptyPoint()
            };
            var ma = x || c('AdsBisonUtils').getEmptyPoint();
            c('AdsReachEstimateLogger').setLoggingData([{
                metadata: {
                    bid: ka,
                    dailyBudget: fa || 0,
                    isAutoBid: !ka,
                    estimateDAU: w,
                    hasFullTargeting: true,
                    showedActions: aa,
                    predictionID: y
                }, prediction: ma
            }]);
            var na = c('adsGKCheck')('ads_delivery_outcome_prediction_survey');
            return (c('React').createElement(c('AdsPredictedOutcomes.react'), {
                estimateDAU: w,
                estimatedCVR: this.state.estimatedCVR,
                isCanvasPromotedObject: ga,
                objective: ha,
                optimizationGoal: ia,
                placementUpsellData: la,
                predictions: ma,
                promotedObjectType: ja,
                showActions: aa,
                showPlacementUpsell: z,
                showSurvey: na
            }));
        };
        u.prototype.$AdsCampaignReachEstimate7 = function () {
            var v = this.state, w = v.facebookReachEstimateData, x = v.instagramReachEstimateData, y = v.usersCount, z = this.props, aa = z.bidAmount, ba = z.dailyBudget, ca = c('AdsBulkValueUtils').getUniformValue(aa, 0), da = {
                bid: ca,
                dailyBudget: ba || 0,
                hasFullTargeting: !(w && x),
                isAutoBid: !ca
            }, ea = [];
            if (w)ea.push({
                metadata: babelHelpers['extends']({}, da, {
                    estimateDAU: w.audienceSize,
                    isFacebookOnly: true,
                    showedActions: false,
                    predictionID: w.predictionID
                }), reachOnlyPrediction: w
            });
            if (x)ea.push({
                metadata: babelHelpers['extends']({}, da, {
                    estimateDAU: x.audienceSize,
                    isInstagramOnly: true,
                    showedActions: false,
                    predictionID: x.predictionID
                }), reachOnlyPrediction: x
            });
            c('AdsReachEstimateLogger').setLoggingData(ea);
            var fa = this.props.eligibleUsersCount > c('AdsOtherConsts').REACH_TOO_LOW_NUMBER && y != null && y <= c('AdsOtherConsts').REACH_TOO_LOW_NUMBER, ga = c('adsGKCheck')('ads_delivery_outcome_prediction_survey');
            return (c('React').createElement(c('AdsReachEstimate.react'), {
                facebookReachEstimateData: w,
                instagramReachEstimateData: x,
                isReachLow: fa,
                showSurvey: ga
            }));
        };
        u.prototype.render = function () {
            var v = this.state, w = v.errorMessage, x = v.isLoading, y = v.shouldShowRedesignedOutcomes;
            if (x)return c('React').createElement(c('BUIAdoptionXUISpinner.react'), {size: 'large'});
            var z = void 0;
            if (w) {
                c('AdsReachEstimateLogger').setHasError();
                z = c('React').createElement('div', null, w);
            } else if (y) {
                z = this.$AdsCampaignReachEstimate6();
            } else z = this.$AdsCampaignReachEstimate7();
            return z;
        };
        u.propTypes = {
            accountID: k.string.isRequired,
            bidAmount: k.instanceOf(c('AdsBulkValue')),
            billingEvent: k.instanceOf(c('AdsBulkValue')),
            currency: k.string.isRequired,
            dailyBudget: k.oneOfType([k.oneOf([null]), k.number]),
            eligibleBidEstimate: k.object,
            eligibleUsersCount: k.number.isRequired,
            endTime: k.instanceOf(c('AdsBulkValue')).isRequired,
            facebookReachEstimate: k.instanceOf(c('LoadObject')),
            id: k.instanceOf(c('AdsBulkValue')).isRequired,
            instagramReachEstimate: k.instanceOf(c('LoadObject')),
            isAutoBid: k.instanceOf(c('AdsBulkValue')).isRequired,
            isCanvasPromotedObject: k.bool,
            isNew: k.instanceOf(c('AdsBulkValue')).isRequired,
            lifetimeBudget: k.instanceOf(c('AdsBulkValue')).isRequired,
            missingPlatforms: k.arrayOf(k.oneOf(Object.values(c('AdsAPIPublisherPlatform')))).isRequired,
            objective: k.instanceOf(c('AdsBulkValue')).isRequired,
            optimizationGoal: k.instanceOf(c('AdsBulkValue')),
            overallPrediction: k.instanceOf(c('LoadObject')),
            promotedObject: k.object,
            promotedObjectType: k.instanceOf(c('AdsBulkValue')),
            redesignedReachPredictionsQE: k.object,
            targetingSpecs: k.object.isRequired
        };
        f.exports = u;
    }), null);

__d('AdsReachEstimateUtils', ['AdsAPIReachEstimateFields', 'getByPath'], (function a(b, c, d, e, f, g) {
    'use strict';
    function h(k) {
        if (!k || !k.hasValue())return null;
        var l = c('getByPath')(k.getValue(), [c('AdsAPIReachEstimateFields').BID_ESTIMATIONS]);
        if (l == null || l[0] == null)return null;
        return l[0];
    }

    function i(k) {
        return k && k.hasValue() ? k.getValueEnforcing().users || 0 : 0;
    }

    var j = {getBidEstimation: h, getUsers: i};
    f.exports = j;
}), null);


__d('LoadObject', ['invariant', 'immutable', 'LoadObjectOperations', 'Map', 'nullthrows'], (function a(b, c, d, e, f, g, h) {
    'use strict';
    var i, j, k = [undefined, null, false, true, 0, ''], l = 'SECRET_' + Math.random(), m = new (c('Map'))(new (c('Map'))(k.map(function (p) {
        return [p, new (c('Map'))([[true, new (c('Map'))()], [false, new (c('Map'))()]])];
    }))), n = c('immutable').Record({
        operation: undefined,
        value: undefined,
        error: undefined,
        internalHasValue: false
    });
    i = babelHelpers.inherits(o, n);
    j = i && i.prototype;
    function o(p, q, r, s, t) {
        p === l || h(0);
        j.constructor.call(this, {operation: q, value: r, error: s, internalHasValue: t});
    }

    o.$LoadObject1 = function (p, q, r, s) {
        var t = o.$LoadObject2(p, q, r, s);
        return (t || new o(l, p, q, r, s));
    };
    o.$LoadObject2 = function (p, q, r, s) {
        if (r !== undefined || !m.has(q))return null;
        var t = c('nullthrows')(m.get(q)), u = c('nullthrows')(t.get(s));
        if (!u.has(p)) {
            var v = new o(l, p, q, r, s);
            u.set(p, v);
        }
        return c('nullthrows')(u.get(p));
    };
    o.prototype.getOperation = function () {
        return this.get('operation');
    };
    o.prototype.getValue = function () {
        return this.get('value');
    };
    o.prototype.getValueEnforcing = function () {
        this.hasValue() || h(0);
        var p = this.getValue();
        return p;
    };
    o.prototype.getError = function () {
        return this.get('error');
    };
    o.prototype.getErrorEnforcing = function () {
        this.hasError() || h(0);
        return this.get('error');
    };
    o.prototype.hasValue = function () {
        return !!this.get('internalHasValue');
    };
    o.prototype.hasOperation = function () {
        return this.getOperation() !== undefined;
    };
    o.prototype.hasError = function () {
        return this.getError() !== undefined;
    };
    o.prototype.isEmpty = function () {
        return !this.hasValue() && !this.hasOperation() && !this.hasError();
    };
    o.prototype.setOperation = function (p) {
        var q = o.$LoadObject2(p, this.getValue(), this.getError(), this.hasValue());
        return q || this.set('operation', p);
    };
    o.prototype.setValue = function (p) {
        var q = o.$LoadObject2(this.getOperation(), p, this.getError(), true);
        return q || this.set('value', p).set('internalHasValue', true);
    };
    o.prototype.setError = function (p) {
        var q = o.$LoadObject2(this.getOperation(), this.getValue(), p, this.hasValue());
        return q || this.set('error', p);
    };
    o.prototype.removeOperation = function () {
        var p = this.remove('operation'), q = o.$LoadObject2(p.getOperation(), p.getValue(), p.getError(), p.hasValue());
        return q || p;
    };
    o.prototype.removeValue = function () {
        var p = this.remove('value').remove('internalHasValue'), q = o.$LoadObject2(p.getOperation(), p.getValue(), p.getError(), p.hasValue());
        return q || p;
    };
    o.prototype.removeError = function () {
        var p = this.remove('error'), q = o.$LoadObject2(p.getOperation(), p.getValue(), p.getError(), p.hasValue());
        return q || p;
    };
    o.prototype.isCreating = function () {
        return this.getOperation() === c('LoadObjectOperations').CREATING;
    };
    o.prototype.isDeleting = function () {
        return this.getOperation() === c('LoadObjectOperations').DELETING;
    };
    o.prototype.isDone = function () {
        return !this.hasOperation();
    };
    o.prototype.isLoading = function () {
        return this.getOperation() === c('LoadObjectOperations').LOADING;
    };
    o.prototype.isUpdating = function () {
        return this.getOperation() === c('LoadObjectOperations').UPDATING;
    };
    o.prototype.creating = function () {
        return this.setOperation(c('LoadObjectOperations').CREATING);
    };
    o.prototype.deleting = function () {
        return this.setOperation(c('LoadObjectOperations').DELETING);
    };
    o.prototype.done = function () {
        return this.removeOperation();
    };
    o.prototype.loading = function () {
        return this.setOperation(c('LoadObjectOperations').LOADING);
    };
    o.prototype.updating = function () {
        return this.setOperation(c('LoadObjectOperations').UPDATING);
    };
    o.prototype.map = function (p) {
        if (!this.hasValue())return this;
        var q = this.getValueEnforcing(), r = p(q), s = r instanceof o ? r : this.setValue(r);
        return s;
    };
    o.creating = function () {
        return o.$LoadObject1(c('LoadObjectOperations').CREATING, undefined, undefined, false);
    };
    o.deleting = function () {
        return o.$LoadObject1(c('LoadObjectOperations').DELETING, undefined, undefined, false);
    };
    o.empty = function () {
        return o.$LoadObject1(undefined, undefined, undefined, false);
    };
    o.loading = function () {
        return o.$LoadObject1(c('LoadObjectOperations').LOADING, undefined, undefined, false);
    };
    o.updating = function () {
        return o.$LoadObject1(c('LoadObjectOperations').UPDATING, undefined, undefined, false);
    };
    o.withError = function (p) {
        return o.$LoadObject1(undefined, undefined, p, false);
    };
    o.withValue = function (p) {
        return o.$LoadObject1(undefined, p, undefined, true);
    };
    f.exports = o;
}), null);

__d("AdsAPIReachEstimateFields", [], (function a(b, c, d, e, f, g) {
    f.exports = {
        USERS: "users",
        BID_ESTIMATIONS: "bid_estimations",
        ESTIMATE_READY: "estimate_ready",
        IMP_ESTIMATES: "imp_estimates",
        TARGETING_SPEC: "targeting_spec",
        CURRENCY: "currency",
        BID_FOR: "bid_for",
        OPTIMIZE_FOR: "optimize_for",
        DAILY_BUDGET: "daily_budget",
        CREATIVE_ACTION_SPEC: "creative_action_spec",
        ADGROUP_IDS: "adgroup_ids",
        CONCEPTS: "concepts",
        BROAD_TARGETING_AGE: "broad_targeting_age",
        CALLER_ID: "caller_id",
        UNSUPPORTED: "unsupported",
        LOCATION: "location",
        CPA_MIN: "cpa_min",
        CPA_MEDIAN: "cpa_median",
        CPA_MAX: "cpa_max",
        CPC_MIN: "cpc_min",
        CPC_MEDIAN: "cpc_median",
        CPC_MAX: "cpc_max",
        CPM_MIN: "cpm_min",
        CPM_MEDIAN: "cpm_median",
        CPM_MAX: "cpm_max",
        REACH_MIN: "reach_min",
        REACH_MAX: "reach_max",
        CPM_CURVE_DATA: "cpm_curve_data",
        CPC_CURVE_DATA: "cpc_curve_data",
        CPA_CURVE_DATA: "cpa_curve_data",
        DEDUP_WINNING_RATE: "dedup_winning_rate",
        DEDUP_STATUS: "dedup_status",
        PACING_STATUS: "pacing_status",
        ACCOUNT_BUDGET: "account_budget",
        ESTIMATE_DAU: "estimate_DAU",
        DATA: "data",
        DATA_SOURCE: "data_source",
        BID_AMOUNT_MIN: "bid_amount_min",
        BID_AMOUNT_MEDIAN: "bid_amount_median",
        BID_AMOUNT_MAX: "bid_amount_max",
        BID_VALUE: "bid_value",
        SCALED_USER_COUNT: "scaledUserCount",
        SAMPLE_USER_IDS: "sampleUserIdList",
        SAMPLING_RATE: "sampling_rate",
        S_EXPRESSION: "s_expression",
        OBJECT_STORE_URL: "object_store_url",
        IS_DEBUG: "is_debug",
        CURVE: "curve",
        BID: "bid",
        SPEND: "spend",
        REACH: "reach",
        IMPRESSIONS: "impressions",
        ACTIONS: "actions",
        IS_CURVE_ELIGIBLE: "is_curve_eligible",
        TRACE_ID: "trace_id",
        PREDICTED_ERRORS_CONVERSIONS: "predicted_errors_conversions",
        PREDICTED_ERRORS_REACH: "predicted_errors_reach"
    };
}), null);

__d("BisonConsts", [], (function a(b, c, d, e, f, g) {
    f.exports = {ApiCurveFieldNames: ["bid", "spend_median", "spend_min", "spend_max", "reach_median", "reach_min", "reach_max", "imp_median", "imp_min", "imp_max", "action_median", "action_min", "action_max"]};
}), null);

__d('AdsCFReachEstimateContainer.react', ['cx', 'fbt', 'invariant', 'AdsAPIAdAccountFields', 'AdsAPIAdCampaignFields', 'AdsAPICampaignPaths', 'AdsBisonUtils', 'AdsBlockListAccountListStore', 'AdsCampaignUtils', 'AdsCFAccountStore', 'AdsCFActiveCampaignIDStore', 'AdsCFAudienceEstimateStore', 'AdsCFCampaignGroupStore', 'AdsCFCampaignStateUtils', 'AdsCFCampaignStore', 'AdsCFCampaignStoreUtils', 'AdsCFCampaignUtils', 'AdsCFConstants', 'AdsCFEligibilityInfoStore', 'AdsCFReachEstimateUtils', 'adsCFSelectedObjectiveSelector', 'AdsFluxContainer', 'AdsOtherConsts', 'AdsPlacementAPISpecWriterUtils', 'AdsPredictedOutcomes.react', 'AdsPredictedOutcomesPlacementUpsellUtils', 'AdsPromotedObjectUtils', 'AdsQEStore', 'AdsReachEstimate.react', 'AdsReachEstimateStore', 'AdsReachEstimateStrings', 'AdsReachEstimateLogger', 'AdsReachEstimateUtils', 'BUIAdoptionXUISpinner.react', 'React', 'adsGKCheck', 'getByPath'], (function a(b, c, d, e, f, g, h, i, j) {
    'use strict';
    var k, l, m = c('React').PropTypes;
    k = babelHelpers.inherits(n, c('React').PureComponent);
    l = k && k.prototype;
    n.getStores = function () {
        return [].concat(c('adsCFSelectedObjectiveSelector').getStores(), [c('AdsBlockListAccountListStore'), c('AdsCFAccountStore'), c('AdsCFActiveCampaignIDStore'), c('AdsCFActiveCampaignIDStore'), c('AdsCFAudienceEstimateStore'), c('AdsCFCampaignGroupStore'), c('AdsCFCampaignStore'), c('AdsCFEligibilityInfoStore'), c('AdsReachEstimateStore')]);
    };
    n.calculateState = function (o) {
        var p = c('AdsCFCampaignStateUtils').getFirstSelectedRecord(c('AdsCFCampaignStore').getState(), c('AdsCFActiveCampaignIDStore').getState()), q = c('AdsCFAudienceEstimateStore').getTargetingEstimateState(c('AdsCFConstants').CanonicalID), r = c('AdsCFCampaignStoreUtils').hasInstagramPlacement(), s = c('AdsCFCampaignStoreUtils').hasFacebookPlacement(), t = {}, u = {};
        if (s)t = c('AdsCFAudienceEstimateStore').getBidEstimateStateForFacebook(c('AdsCFConstants').CanonicalID);
        if (r)u = c('AdsCFAudienceEstimateStore').getBidEstimateStateForInstagram(c('AdsCFConstants').CanonicalID);
        var v = 0;
        if (s) {
            v = v || t.estimate_DAU;
        } else v = v || u.estimate_DAU;
        var w = q.users || 0, x = c('AdsCFAccountStore').getSelectedAccountIDX(), y = p.toJS(), z = c('getByPath')(y, c('AdsAPICampaignPaths').TARGETING.path), aa = c('getByPath')(y, c('AdsAPICampaignPaths').PROMOTED_OBJECT.OBJECT_STORE_URL), ba = y[c('AdsAPIAdCampaignFields').OPTIMIZATION_GOAL], ca = c('AdsCFAccountStore').getSelectedAccount()[c('AdsAPIAdAccountFields').CURRENCY], da = c('AdsCFEligibilityInfoStore').get(), ea = c('AdsPlacementAPISpecWriterUtils').addAllElgiblePlatforms(da, z), fa = c('AdsReachEstimateStore').getReachEstimateForAccount(x, ca, ea, null, ba, aa), ga = c('AdsReachEstimateUtils').getUsers(fa), ha = c('AdsReachEstimateUtils').getBidEstimation(fa), ia = c('AdsCFAudienceEstimateStore').isEstimateLoading(), ja = null, ka = c('AdsQEStore').get(c('AdsPredictedOutcomesPlacementUpsellUtils').QE_NAME, x), la = c('AdsPredictedOutcomesPlacementUpsellUtils').getShouldShowRedesign(ka), ma = c('AdsPredictedOutcomesPlacementUpsellUtils').getShouldShowUpsell(ka), na = c('AdsPredictedOutcomesPlacementUpsellUtils').getShouldShowActions(ka);
        if (la) {
            var oa = c('AdsReachEstimateStore').getReachEstimateForAccount(x, ca, z, null, ba, aa);
            ja = c('AdsReachEstimateUtils').getBidEstimation(oa);
            ia = oa.isLoading();
        }
        var pa = c('adsGKCheck')('ads_delivery_outcome_prediction_survey'), qa = c('adsCFSelectedObjectiveSelector')();
        return {
            audienceSize: v,
            bidEstimateForFacebook: t,
            bidEstimateForInstagram: u,
            campaign: p,
            eligibleBidEstimate: ha,
            eligibleUsersCount: ga,
            hasFacebookPlacement: s,
            hasInstagramPlacement: r,
            isCanvasPromotedObject: c('AdsPromotedObjectUtils').getIsPromotedCanvasApp(y),
            isLoading: ia,
            missingPlatforms: c('AdsPredictedOutcomesPlacementUpsellUtils').getPlatformsToUpsell(da, z),
            objective: qa,
            optimizationGoal: ba,
            overallBidEstimate: ja,
            promotedObjectType: c('AdsCampaignUtils').getPromotedObjectType(qa, p),
            shouldShowActions: na,
            shouldShowPlacementUpsell: ma,
            shouldShowRedesignedOutcomes: la,
            shouldShowSurvey: pa,
            targetState: q,
            usersCount: w
        };
    };
    n.prototype.render = function () {
        if (this.$AdsCFReachEstimateContainer1()) {
            c('AdsReachEstimateLogger').setHasError();
            if (!this.state.shouldShowRedesignedOutcomes)return null;
        }
        return (c('React').createElement('div', {className: "_5t__" + (this.state.isLoading ? ' ' + "loading" : '')}, this.$AdsCFReachEstimateContainer2(), c('React').createElement('div', {className: this.state.isLoading ? "hidden_elem" : ''}, this.props.audienceWarning)));
    };
    n.prototype.$AdsCFReachEstimateContainer2 = function () {
        if (this.state.isLoading)return c('React').createElement(c('BUIAdoptionXUISpinner.react'), {size: 'large'});
        if (this.state.shouldShowRedesignedOutcomes)return this.$AdsCFReachEstimateContainer3();
        return (c('React').createElement('div', null, c('React').createElement('h4', {className: "_aq9 _3-97 _2pip"}, i._("Estimated Daily Reach")), c('React').createElement('div', {className: "_5u3x"}, this.$AdsCFReachEstimateContainer4(), this.$AdsCFReachEstimateContainer5())));
    };
    n.prototype.$AdsCFReachEstimateContainer3 = function () {
        var o = this.state, p = o.campaign, q = o.eligibleBidEstimate, r = o.isCanvasPromotedObject,
            s = o.missingPlatforms, t = o.objective, u = o.optimizationGoal, v = o.overallBidEstimate,
            w = o.promotedObjectType, x = o.shouldShowActions, y = o.shouldShowPlacementUpsell,
            z = o.shouldShowSurvey, aa = c('AdsBisonUtils').getEmptyPoint(), ba = void 0, ca = 0, da = 0,
            ea = '';
        if (v) {
            aa = c('AdsBisonUtils').getPointPredictionForCampaign(v, this.$AdsCFReachEstimateContainer6(), p);
            ca = v.estimate_DAU;
            da = this.$AdsCFReachEstimateContainer7();
            ea = v.trace_id;
            if (q && y)ba = {
                missingPlatforms: s,
                upsellPredictions: c('AdsBisonUtils').getPointPredictionForCampaign(q, this.$AdsCFReachEstimateContainer6(), p)
            };
        }
        c('AdsReachEstimateLogger').setLoggingData([{
            metadata: babelHelpers['extends']({}, this.$AdsCFReachEstimateContainer8(), {
                estimateDAU: ca,
                hasFullTargeting: true,
                predictionID: ea,
                showedActions: y
            }), prediction: aa
        }]);
        return (c('React').createElement('div', null, c('React').createElement('h4', {
            className: "_aq9 _3-96",
            display: 'block',
            size: 'medium',
            weight: 'bold'
        }, c('AdsReachEstimateStrings').PREDICTED_OUTCOMES), c('React').createElement(c('AdsPredictedOutcomes.react'), {
            estimateDAU: ca,
            estimatedCVR: da,
            isCanvasPromotedObject: r,
            objective: t,
            optimizationGoal: u,
            placementUpsellData: ba,
            predictions: aa,
            promotedObjectType: w,
            showActions: x,
            showPlacementUpsell: y,
            showSurvey: z
        })));
    };
    n.prototype.$AdsCFReachEstimateContainer4 = function () {
        var o = void 0, p = void 0, q = [];
        if (this.state.hasFacebookPlacement) {
            o = {
                audienceSize: this.state.bidEstimateForFacebook.estimate_DAU || 0,
                reachBounds: this.$AdsCFReachEstimateContainer9(),
                spend: this.$AdsCFReachEstimateContainer6()
            };
            q.push({
                metadata: babelHelpers['extends']({}, this.$AdsCFReachEstimateContainer8(), {
                    isFacebookOnly: true,
                    estimateDAU: o.audienceSize,
                    predictionID: this.state.bidEstimateForFacebook.trace_id
                }), reachOnlyPrediction: o
            });
        }
        if (this.state.hasInstagramPlacement) {
            p = {
                audienceSize: this.state.bidEstimateForInstagram.estimate_DAU || 0,
                reachBounds: this.$AdsCFReachEstimateContainer10(),
                spend: this.$AdsCFReachEstimateContainer6()
            };
            q.push({
                metadata: babelHelpers['extends']({}, this.$AdsCFReachEstimateContainer8(), {
                    isInstagramOnly: true,
                    estimateDAU: p.audienceSize,
                    predictionID: this.state.bidEstimateForInstagram.trace_id
                }), reachOnlyPrediction: p
            });
        }
        c('AdsReachEstimateLogger').setLoggingData(q);
        var r = this.state.eligibleUsersCount > c('AdsOtherConsts').REACH_TOO_LOW_NUMBER && this.state.usersCount <= c('AdsOtherConsts').REACH_TOO_LOW_NUMBER;
        return (c('React').createElement(c('AdsReachEstimate.react'), {
            facebookReachEstimateData: o,
            instagramReachEstimateData: p,
            isReachLow: r,
            showSurvey: this.state.shouldShowSurvey
        }));
    };
    n.prototype.$AdsCFReachEstimateContainer5 = function () {
        if (c('AdsCampaignUtils').isContinuoslySchedule(this.state.campaign))return null;
        if (!c('AdsCFAccountStore').getSelectedAccount()[c('AdsAPIAdAccountFields').TIMEZONE_OFFSET_HOURS_UTC])return null;
        var o = c('AdsCFCampaignUtils').getStartDate(this.state.campaign), p = c('AdsCFCampaignUtils').getEndDate(this.state.campaign);
        p || j(0);
        var q = c('AdsCampaignUtils').getCampaignDayCount(o, p);
        return (c('React').createElement('span', {className: "_5u40"}, i._("Ad set duration: {num_days}", [i.param('num_days', c('AdsCampaignUtils').getCampaignDaysLabel(q))])));
    };
    n.prototype.$AdsCFReachEstimateContainer7 = function () {
        var o = 0;
        if (this.state.overallBidEstimate) {
            var p = c('AdsBisonUtils').getLastPointPredictionForCampaign(this.state.overallBidEstimate, this.state.campaign);
            o = c('AdsBisonUtils').getEstimatedCVR(p.actions, p.impressions);
        }
        return o;
    };
    n.prototype.$AdsCFReachEstimateContainer9 = function () {
        return c('AdsCFReachEstimateUtils').getReachBounds(this.state.bidEstimateForFacebook, this.$AdsCFReachEstimateContainer6(), this.state.campaign);
    };
    n.prototype.$AdsCFReachEstimateContainer10 = function () {
        return c('AdsCFReachEstimateUtils').getReachBounds(this.state.bidEstimateForInstagram, this.$AdsCFReachEstimateContainer6(), this.state.campaign);
    };
    n.prototype.$AdsCFReachEstimateContainer11 = function () {
        var o = this.state.targetState;
        return !!(o.estimateErrors && o.estimateErrors.length && o.estimateReady);
    };
    n.prototype.$AdsCFReachEstimateContainer1 = function () {
        if (this.$AdsCFReachEstimateContainer11())return true;
        if (this.state.shouldShowRedesignedOutcomes && !this.state.isLoading && !this.state.overallBidEstimate)return true;
        var o = this.state.campaign.getIn(c('AdsAPICampaignPaths').OPTIMIZATION_GOAL), p = c('AdsBisonUtils').getCurveString(o, this.state.bidEstimateForFacebook) || c('AdsBisonUtils').getCurveString(o, this.state.bidEstimateForInstagram);
        if (!p)return true;
        var q = [this.state.audienceSize];
        if (this.state.hasFacebookPlacement)q.push(this.$AdsCFReachEstimateContainer9().max);
        if (this.state.hasInstagramPlacement)q.push(this.$AdsCFReachEstimateContainer10().max);
        return !q.every(function (r) {
            return r;
        });
    };
    n.prototype.$AdsCFReachEstimateContainer6 = function () {
        return c('AdsCFCampaignUtils').getDailyBudget(this.state.campaign, c('AdsCFAccountStore').getSelectedAccount()[c('AdsAPIAdAccountFields').TIMEZONE_OFFSET_HOURS_UTC]);
    };
    n.prototype.$AdsCFReachEstimateContainer8 = function () {
        var o = this.state, p = o.campaign, q = o.hasFacebookPlacement, r = o.hasInstagramPlacement, s = c('AdsCFReachEstimateUtils').getBidForReachEstimation(p);
        return {
            bid: s || 0,
            dailyBudget: this.$AdsCFReachEstimateContainer6(),
            hasFullTargeting: !(q && r),
            isAutoBid: p.is_autobid
        };
    };
    function n() {
        k.apply(this, arguments);
    }

    n.propTypes = {audienceWarning: m.node};
    f.exports = c('AdsFluxContainer').create(n, {withProps: true});
}), null);

__d('AdsReachEstimateStore', ['AdsDispatcher', 'AdsLoadState', 'AdsReachEstimateActionTypes', 'AdsReachEstimateDataDispatcher', 'FluxLoadObjectStore', 'immutable', 'LoadObject', 'AdsReachEstimateRecord', 'adsBaseStoreMixin', 'isValidTargetingSpec'], (function a(b, c, d, e, f, g) {
    'use strict';
    var h, i, j = c('AdsReachEstimateRecord').ReachEstimateAccountRecord, k = c('AdsReachEstimateRecord').ReachEstimateCampaignRecord, l = Error(c('AdsLoadState').ERROR);
    h = babelHelpers.inherits(m, c('FluxLoadObjectStore'));
    i = h && h.prototype;
    function m() {
        i.constructor.call(this, c('AdsDispatcher'));
        c('adsBaseStoreMixin')(this);
    }

    m.prototype.getStoreName = function () {
        return 'AdsReachEstimateStore';
    };
    m.prototype.getReachEstimateForAccount = function (o, p, q, r, s, t, u, v) {
        if (!c('isValidTargetingSpec')(q))return c('LoadObject').withError(l);
        var w = new j({
            accountID: o,
            currency: p || '',
            targetingSpec: c('immutable').fromJS(q),
            creativeActionSpec: c('immutable').fromJS(r || null),
            optimizeFor: s,
            object_store_url: t || '',
            bidValue: u || 0
        }), x = this.get(w);
        if (x.hasError() && v) {
            this.__load(w);
            return c('LoadObject').loading();
        }
        return x;
    };
    m.prototype.getReachEstimateForCampaignOrAccount = function (o, p, q, r, s, t, u, v, w, x) {
        if (!c('isValidTargetingSpec')(r))return c('LoadObject').withError(l);
        if (w || !o)return this.getReachEstimateForAccount(p, q, r, s, t, u, v, x);
        var y = new k({campaignID: o, targetingSpec: c('immutable').fromJS(r), optimizeFor: t}), z = this.get(y);
        if (z.hasError() && x) {
            this.__load(y);
            return c('LoadObject').loading();
        }
        return z;
    };
    m.prototype.reduce = function (o, p) {
        var q = p.action;
        switch (q.actionType) {
            case c('AdsReachEstimateActionTypes').LOAD_SUCCESS:
                return this.__handleOne(o, q.params, q.data);
            case c('AdsReachEstimateActionTypes').LOAD_ERROR:
                return this.__handleOne(o, q.params, l);
            case c('AdsReachEstimateActionTypes').STARTED_LOAD:
                return this.__setLoading(o, c('immutable').List.of(q.params));
            default:
                return o;
        }
    };
    m.prototype.__handleOne = function (o, p, q) {
        var r = this.getCached(p);
        if (q instanceof Error) {
            return o.set(p, r.setError(q).removeValue().done());
        } else return o.set(p, r.setValue(q).removeError().done());
    };
    m.prototype.__load = function (o) {
        if (o instanceof k) {
            c('AdsReachEstimateDataDispatcher').loadReachEstimateForCampaign(o);
        } else if (o instanceof j)c('AdsReachEstimateDataDispatcher').loadReachEstimateForAccount(o);
    };
    var n = new m();
    b.debug_AdsReachEstimateStore = n;
    f.exports = n;
}), null);

__d('AdsCampaignReachEstimateSection.react', ['fbt', 'AdsBulkValue', 'AdsBulkValueUtils', 'AdsCampaignReachEstimate.react', 'AdsCampaignUtils', 'AdsCard.react', 'AdsQE', 'AdsReachEstimateStrings', 'BUIAdoptionXUIText.react', 'DateTime', 'LoadObject', 'React', 'unixTimestampFromDate'],
    (function a(b, c, d, e, f, g, h) {
        'use strict';
        var i, j, k = c('AdsCard.react').Header, l = c('AdsCard.react').HeaderTitle,
            m = c('AdsCard.react').Section, n = c('React').PropTypes;
        i = babelHelpers.inherits(o, c('React').Component);
        j = i && i.prototype;
        o.prototype.render = function () {
            if (!this.props.showTitle)return
            (c('React').createElement('div', null, c('React').createElement(c('BUIAdoptionXUIText.react'), {weight: 'bold'}, this.$AdsCampaignReachEstimateSection1()), this.$AdsCampaignReachEstimateSection2()));
            return (c('React').createElement(c('AdsCard.react'), null, c('React').createElement(k, null, c('React').createElement(l, null, this.$AdsCampaignReachEstimateSection1())), c('React').createElement(m, {className: 'uiContextualLayerParent'}, this.$AdsCampaignReachEstimateSection2())));
        };
        o.prototype.$AdsCampaignReachEstimateSection3 = function () {
            var p = this.props.timezoneID, q = c('AdsBulkValueUtils').getUniformValue(this.props.dailyBudget), r = c('AdsBulkValueUtils').getUniformValue(this.props.lifetimeBudget), s = c('AdsBulkValueUtils').getUniformValue(this.props.startTime), t = c('AdsBulkValueUtils').getUniformValue(this.props.endTime);
            return c('AdsCampaignUtils').getDailyBudgetEstimate(q, r, s ? new (c('DateTime'))(c('unixTimestampFromDate')(s), p) : null, t ? new (c('DateTime'))(c('unixTimestampFromDate')(t), p) : null);
        };
        o.prototype.$AdsCampaignReachEstimateSection2 = function () {
            return (c('React').createElement(c('AdsCampaignReachEstimate.react'), {
                accountID: this.props.accountID,
                bidAmount: this.props.bidAmount,
                bidInfo: this.props.bidInfo,
                bidType: this.props.bidType,
                billingEvent: this.props.billingEvent,
                currency: this.props.currency,
                dailyBudget: this.$AdsCampaignReachEstimateSection3(),
                eligibleBidEstimate: this.props.eligibleBidEstimate,
                eligibleUsersCount: this.props.eligibleUsersCount,
                endTime: this.props.endTime,
                facebookReachEstimate: this.props.facebookReachEstimate,
                id: this.props.campaignID,
                instagramReachEstimate: this.props.instagramReachEstimate,
                isAutoBid: this.props.isAutoBid,
                isCanvasPromotedObject: this.props.isCanvasPromotedObject || false,
                isNew: this.props.isNew,
                lifetimeBudget: this.props.lifetimeBudget,
                missingPlatforms: this.props.missingPlatforms,
                objective: this.props.objective,
                optimizationGoal: this.props.optimizationGoal,
                overallPrediction: this.props.overallPrediction,
                promotedObject: this.props.promotedObject,
                promotedObjectType: this.props.promotedObjectType,
                redesignedReachPredictionsQE: this.props.redesignedReachPredictionsQE,
                targetingSpecs: this.props.targetingSpecs
            }));
        };
        o.prototype.$AdsCampaignReachEstimateSection1 = function () {
            var p = this.props.shouldShowRedesignedOutcomes ? c('AdsReachEstimateStrings').PREDICTED_OUTCOMES : h._("Estimated Daily Reach");
            return p;
        };
        function o() {
            i.apply(this, arguments);
        }

        o.propTypes = {
            accountID: n.string.isRequired,
            bidAmount: n.instanceOf(c('AdsBulkValue')),
            bidInfo: n.object,
            bidType: n.instanceOf(c('AdsBulkValue')),
            billingEvent: n.instanceOf(c('AdsBulkValue')),
            campaignID: n.instanceOf(c('AdsBulkValue')).isRequired,
            currency: n.string,
            dailyBudget: n.instanceOf(c('AdsBulkValue')).isRequired,
            eligibleBidEstimate: n.object,
            eligibleUsersCount: n.number.isRequired,
            endTime: n.instanceOf(c('AdsBulkValue')).isRequired,
            facebookReachEstimate: n.instanceOf(c('LoadObject')),
            instagramReachEstimate: n.instanceOf(c('LoadObject')),
            isAutoBid: n.instanceOf(c('AdsBulkValue')).isRequired,
            isCanvasPromotedObject: n.bool,
            isNew: n.instanceOf(c('AdsBulkValue')),
            lifetimeBudget: n.instanceOf(c('AdsBulkValue')).isRequired,
            missingPlatforms: n.arrayOf(n.string).isRequired,
            objective: n.instanceOf(c('AdsBulkValue')).isRequired,
            optimizationGoal: n.instanceOf(c('AdsBulkValue')),
            overallPrediction: n.instanceOf(c('LoadObject')),
            promotedObject: n.object,
            promotedObjectType: n.instanceOf(c('AdsBulkValue')),
            redesignedReachPredictionsQE: n.object,
            shouldShowRedesignedOutcomes: n.bool,
            showTitle: n.bool.isRequired,
            startTime: n.instanceOf(c('AdsBulkValue')).isRequired,
            targetingAPISpec: n.object.isRequired,
            targetingSpecs: n.object.isRequired,
            timezoneID: n.number.isRequired
        };
        f.exports = o;
    }), null);

__d('AdsCMCampaignRedesignedOverview.react', ['cx', 'fbt', 'AdsAPIAdCampaignFields', 'AdsAPICampaignPaths', 'AdsAPIObjectives', 'AdsAPIPacingType', 'AdsAPIReachFrequencyPredictionFields', 'AdsAPIStatisticFields', 'AdsAPITargetSpendFields', 'AdsAppUtils', 'AdsBillingEventStrings', 'AdsCampaignReachEstimateSection.react', 'AdsCampaignUtils', 'AdsCMAdgroupThumbnail.react', 'AdsCMObjectDelivery.react', 'AdsCMOverviewSpend.react', 'AdsCMPromotedObjectLinkOverview.react', 'AdsCMPromotedObjectUtil', 'AdsCMScheduleUtils', 'AdsCMSplitTestNoticeCardContainer.react', 'AdsCreateRuleCard.react', 'AdsCurrencyFormatter', 'AdsErrorBoundary.react', 'AdsLoadStateUtils', 'AdsObjectTypes', 'AdsOptimizationGoalStrings', 'AdsOptimizationStrings', 'AdsPageUtils', 'AdsPlacementV2UIUtils', 'AdsQE', 'AdsReachFrequencyFrequencyCapMessage.react', 'AdsUniformValue', 'BUIAdoptionXUIText.react', 'CustomEventType', 'DateConsts', 'Link.react', 'LoadObject', 'PagesInsightsMessagesController.react', 'React', 'URI', 'AdsPlacementAPISpecReaderUtils', 'ads-lib-formatters', 'aggregateCampaignSpecs', 'arrayContains', 'AdsPlacementAPIMigrationUtils', 'getByPath', 'intlList', 'joinClasses', 'nullthrows'],
    (function a(b, c, d, e, f, g, h, i) {
        'use strict';
        var j, k, l, m, n = c('AdsPlacementAPISpecReaderUtils').convertCampaignToPlacementSpec,
            o = c('AdsPlacementAPIMigrationUtils').deprecate,
            p = c('ads-lib-formatters').createIntlNumberFormatter(0), q = c('React').PropTypes;
        j = babelHelpers.inherits(r, c('React').PureComponent);
        k = j && j.prototype;
        function r() {
            var t, u;
            for (var v = arguments.length, w = Array(v), x = 0; x < v; x++)w[x] = arguments[x];
            return u = (t = k.constructor).call.apply(t, [this].concat(w)), this.state = {targetingExpanded: false}, this.$AdsCMCampaignRedesignedOverview1 = function () {
                return (c('React').createElement('div', {className: "_3-96"}, c('React').createElement('div', {className: "_3rib"}, i._("Delivery")), c('React').createElement(c('AdsCMObjectDelivery.react'), {
                    className: "_3ric _2pih",
                    deliveryInfo: this.props.campaign[c('AdsAPIAdCampaignFields').DELIVERY_INFO],
                    objectType: c('AdsObjectTypes').CAMPAIGN
                }), this.$AdsCMCampaignRedesignedOverview2()));
            }.bind(this), this.$AdsCMCampaignRedesignedOverview3 = function () {
                var y = c('AdsCMScheduleUtils').getTimerangeUIData(this.props.campaign[c('AdsAPIAdCampaignFields').START_TIME], this.props.campaign[c('AdsAPIAdCampaignFields').END_TIME]).rangeFull, z = null, aa = this.props.campaign[c('AdsAPIAdCampaignFields').PACING_TYPE];
                if (c('arrayContains')(aa, c('AdsAPIPacingType').DAY_PARTING))z = i._("Scheduled for specific hours of the day.");
                return (c('React').createElement('div', {className: "_3-96"}, c('React').createElement('div', {className: "_3rib"}, i._("Schedule")), c('React').createElement('div', {className: "_3ric"}, y, c('React').createElement('div', null, z))));
            }.bind(this), this.$AdsCMCampaignRedesignedOverview4 = function () {
                return c('getByPath')(this.props.campaign, o(c('AdsAPICampaignPaths').TARGETING.PAGE_TYPES), []);
            }.bind(this), this.$AdsCMCampaignRedesignedOverview6 = function () {
                var y = this.props.targetingSentenceLines;
                if (!y || y.length === 0)return null;
                var z = void 0, aa = void 0, ba = void 0;
                if (!this.state.targetingExpanded) {
                    z = c('React').createElement(s, {ellipsize: true, sentenceLines: y.slice(0, 2)});
                    var ca = Math.max(y.length - 2, 0);
                    if (ca > 0)aa = c('React').createElement(c('Link.react'), {
                        onClick: function () {
                            return this.setState({targetingExpanded: true});
                        }.bind(this)
                    }, i._("See More"));
                } else {
                    z = c('React').createElement(s, {ellipsize: false, sentenceLines: y});
                    ba = c('React').createElement(c('Link.react'), {
                        onClick: function () {
                            return this.setState({targetingExpanded: false});
                        }.bind(this)
                    }, i._("See Less"));
                }
                return (c('React').createElement('div', {className: "_3-96"}, c('React').createElement('div', {className: "_3rib"}, i._("Targeting")), c('React').createElement('div', {className: "_3ric"}, z, aa, ba)));
            }.bind(this), this.$AdsCMCampaignRedesignedOverview8 = function () {
                var y = void 0;
                if (this.props.campaign[c('AdsAPIAdCampaignFields').BID_AMOUNT]) {
                    var z = this.props.campaign[c('AdsAPIAdCampaignFields').IS_AVERAGE_PRICE_PACING] ? c('AdsOptimizationStrings').getAverageBidOptionLabel() : '';
                    y = c('React').createElement('div', {className: "_3ric"}, i._("Manual bid: {Bid amount} {Average} per {optimization goal}", [i.param('Bid amount', c('AdsCurrencyFormatter').formatCurrencyWithNumberDelimiters(this.props.currency, this.props.campaign[c('AdsAPIAdCampaignFields').BID_AMOUNT])), i.param('Average', z), i.param('optimization goal', c('AdsOptimizationGoalStrings').getResultTypeString(this.props.campaign[c('AdsAPIAdCampaignFields').OPTIMIZATION_GOAL]))]));
                }
                var aa = void 0;
                if (c('AdsAppUtils').isAppEventOptimization(this.props.objective, this.props.campaign[c('AdsAPIAdCampaignFields').OPTIMIZATION_GOAL])) {
                    var ba = c('getByPath')(this.props.campaign, c('AdsAPICampaignPaths').PROMOTED_OBJECT.CUSTOM_EVENT_TYPE);
                    if (ba)aa = c('React').createElement('div', {className: "_3ric"}, i._("Optimized app event: {App Event}", [i.param('App Event', c('CustomEventType')[ba])]));
                }
                return (c('React').createElement('div', {className: "_3-96"}, c('React').createElement('div', {className: "_3rib"}, i._("Bidding & Optimization")), c('React').createElement('div', {className: "_3ric"}, i._("Ad delivery optimized for {Optimization goal}", [i.param('Optimization goal', c('AdsOptimizationGoalStrings').getTitle(this.props.campaign[c('AdsAPIAdCampaignFields').OPTIMIZATION_GOAL], this.props.objective))])), aa, y, c('React').createElement('div', {className: "_3ric"}, i._("You'll get charged per {Billing event}", [i.param('Billing event', c('AdsBillingEventStrings').getLabel(this.props.campaign[c('AdsAPIAdCampaignFields').BILLING_EVENT]))]))));
            }.bind(this), this.$AdsCMCampaignRedesignedOverview9 = function () {
                var y = this.props.campaign, z = y[c('AdsAPITargetSpendFields').TODAY_TARGET_SPEND], aa = y[c('AdsAPITargetSpendFields').LIFETIME_TARGET_SPEND];
                if (!z || z.has_error) {
                    z = undefined;
                } else {
                    z = z.amount;
                    z = z != null ? +z : undefined;
                }
                if (!aa || aa.has_error) {
                    aa = undefined;
                } else {
                    aa = aa.amount;
                    aa = aa != null ? +aa : undefined;
                }
                return (c('React').createElement('div', {className: "_3-96"}, c('React').createElement('div', {className: "_3rif"}, i._("Amount Spent Today")), c('React').createElement(c('AdsCMOverviewSpend.react'), {
                    currency: this.props.currency,
                    lifetimeSpent: +y[c('AdsAPIStatisticFields').LIFETIME_SPENT],
                    lifetimeTargetSpend: aa,
                    todaySpent: y[c('AdsAPIStatisticFields').TODAY_SPENT],
                    todayTargetSpend: z
                })));
            }.bind(this), this.$AdsCMCampaignRedesignedOverview10 = function () {
                var y = this.props.adgroupsMetadata;
                if (y.length === 0 || !y[0] || !y[0].creative)return null;
                return (c('React').createElement(c('AdsCMAdgroupThumbnail.react'), {
                    className: "_3rig",
                    creative: y[0].creative
                }));
            }.bind(this), this.$AdsCMCampaignRedesignedOverview11 = function () {
                if (this.props.rfPrediction) {
                    var y = this.props.rfPrediction[c('AdsAPIReachFrequencyPredictionFields').EXTERNAL_IMPRESSION], z = this.props.rfPrediction[c('AdsAPIReachFrequencyPredictionFields').EXTERNAL_REACH], aa = y / z, ba = this.props.campaign[c('AdsAPIAdCampaignFields').FREQUENCY_CAP], ca = this.props.campaign[c('AdsAPIAdCampaignFields').FREQUENCY_CAP_RESET_PERIOD] / c('DateConsts').HOUR_PER_DAY;
                    return (c('React').createElement('div', {className: "_3-96"}, c('React').createElement('div', {className: "_3rib"}, i._("Frequency")), c('React').createElement('div', {className: "_3ric"}, c('React').createElement('div', null, i._("Frequency Cap: {Frequency cap message}", [i.param('Frequency cap message', c('React').createElement(c('AdsReachFrequencyFrequencyCapMessage.react'), {
                        frequencyCap: ba,
                        intervalFrequencyCapResetPeriod: ca
                    }))])), c('React').createElement('div', null, i._("Avg. Frequency: {Average frequency}", [i.param('Average frequency', c('ads-lib-formatters').formatNumber(aa, 2))])))));
                }
            }.bind(this), this.$AdsCMCampaignRedesignedOverview12 = function () {
                return (c('React').createElement('div', {className: "_3-96"}, c('React').createElement('div', {className: "_3rib"}, i._("Buying Type")), c('React').createElement('div', {className: "_3ric"}, i._("Reach and Frequency"))));
            }, this.$AdsCMCampaignRedesignedOverview13 = function () {
                if (this.props.rfPrediction) {
                    var y = this.props.rfPrediction[c('AdsAPIReachFrequencyPredictionFields').EXTERNAL_REACH];
                    return (c('React').createElement('div', {className: "_3-96"}, c('React').createElement('div', {className: "_3rib"}, i._("Target Reach")), c('React').createElement('div', {className: "_3ric"}, i._("{Target Reach Value} people", [i.param('Target Reach Value', p(y))]))));
                }
            }.bind(this), this.$AdsCMCampaignRedesignedOverview15 = function () {
                var y = this.props.campaign[c('AdsAPIAdCampaignFields').CAMPAIGN_ID];
                return (c('React').createElement(c('AdsCMSplitTestNoticeCardContainer.react'), {
                    campaignGroupID: y,
                    objectType: c('AdsObjectTypes').CAMPAIGN
                }));
            }.bind(this), u;
        }

        r.prototype.$AdsCMCampaignRedesignedOverview2 = function () {
            if (this.props.adgroupsCount !== this.props.adgroupsMetadata.length)return null;
            var t = c('AdsCMPromotedObjectUtil').getSpecsForCampaign(this.props.campaign, this.props.objective, this.props.adgroupsMetadata);
            if (t.length === 0)return null;
            var u = [];
            t.forEach(function (aa) {
                var ba = aa.label, ca = aa.uri;
                if (!ca || !ba)return;
                u.push(c('React').createElement(c('AdsCMPromotedObjectLinkOverview.react'), {
                    key: ca,
                    label: ba,
                    uri: ca
                }));
            });
            if (this.props.page) {
                var v = c('getByPath')(this.props.campaign, c('AdsAPICampaignPaths').PROMOTED_OBJECT.PAGE_ID), w = c('nullthrows')(this.props.page);
                if (c('AdsLoadStateUtils').isLoaded(w) && c('AdsPageUtils').canSeePageInsights(w) && c('AdsCampaignUtils').isMessengerThreadSelected(this.props.campaign)) {
                    var x = i._("View Messenger Insights"), y = {section: c('PagesInsightsMessagesController.react').getName()}, z = new (c('URI'))('/' + v + '/insights/').setQueryData(y).getQualifiedURI();
                    u.push(c('React').createElement(c('AdsCMPromotedObjectLinkOverview.react'), {
                        key: z,
                        label: x,
                        uri: z
                    }));
                }
            }
            return c('React').createElement('div', null, u);
        };
        r.prototype.$AdsCMCampaignRedesignedOverview5 = function () {
            var t = c('AdsPlacementV2UIUtils').getFriendlyPlacements(n(this.props.campaign));
            return c('React').createElement('div', {className: "_3-96"}, c('React').createElement('div', {className: "_3rib"}, i._("Placement")), c('React').createElement('div', {className: "_3ric"}, t));
        };
        r.prototype.$AdsCMCampaignRedesignedOverview7 = function () {
            var t = this.props.campaign, u = c('aggregateCampaignSpecs')([t]);
            return c('React').createElement(c('AdsCampaignReachEstimateSection.react'), {
                accountID: t[c('AdsAPIAdCampaignFields').ACCOUNT_ID],
                bidAmount: u[c('AdsAPIAdCampaignFields').BID_AMOUNT],
                bidInfo: u[c('AdsAPIAdCampaignFields').BID_INFO],
                bidType: u[c('AdsAPIAdCampaignFields').BID_TYPE],
                billingEvent: u[c('AdsAPIAdCampaignFields').BILLING_EVENT],
                campaignID: u[c('AdsAPIAdCampaignFields').ID],
                currency: this.props.currency,
                dailyBudget: u[c('AdsAPIAdCampaignFields').DAILY_BUDGET],
                eligibleUsersCount: this.props.eligibleUsersCount,
                endTime: u[c('AdsAPIAdCampaignFields').END_TIME],
                facebookReachEstimate: this.props.facebookReachEstimate,
                instagramReachEstimate: this.props.instagramReachEstimate,
                isAutoBid: u[c('AdsAPIAdCampaignFields').IS_AUTOBID],
                isNew: new (c('AdsUniformValue'))(false),
                lifetimeBudget: u[c('AdsAPIAdCampaignFields').LIFETIME_BUDGET],
                missingPlatforms: [],
                objective: c('nullthrows')(c('AdsUniformValue').create([this.props.objective])),
                optimizationGoal: u[c('AdsAPIAdCampaignFields').OPTIMIZATION_GOAL],
                promotedObject: u[c('AdsAPIAdCampaignFields').PROMOTED_OBJECT],
                redesignedReachPredictionsQE: this.props.redesignedReachPredictionsQE,
                shouldShowRedesignedOutcomes: false,
                showTitle: false,
                startTime: u[c('AdsAPIAdCampaignFields').START_TIME],
                targetingAPISpec: t[c('AdsAPIAdCampaignFields').TARGETING],
                targetingSpecs: u[c('AdsAPIAdCampaignFields').TARGETING],
                timezoneID: this.props.timezoneID
            });
        };
        r.prototype.$AdsCMCampaignRedesignedOverview14 = function () {
            if (this.props.isSplitTestActive)return null;
            return c('React').createElement(c('AdsErrorBoundary.react'), {moduleName: 'AdsCreateRuleCard'}, c('React').createElement(c('AdsCreateRuleCard.react'), {
                canWrite: this.props.canWrite,
                hasClosedRuleCardLoadObject: this.props.hasClosedRuleCardLoadObject,
                hasRules: this.props.hasRules,
                ids: [this.props.campaign[c('AdsAPIAdCampaignFields').ID]],
                objectType: 'CAMPAIGN',
                ruleUILoggingSource: 'am_info_card',
                selection: {level: 'CAMPAIGN', campaigns: [this.props.campaign[c('AdsAPIAdCampaignFields').ID]]},
                whitelistedRuleDialogTypes: this.props.whitelistedRuleDialogTypes
            }));
        };
        r.prototype.render = function () {
            var t = this.props, u = t.isRFCampaign, v = t.isSplitTestActive, w = t.showReachEstimate;
            return (c('React').createElement('div', null, c('React').createElement(c('BUIAdoptionXUIText.react'), {
                className: "_3-97",
                display: 'block',
                size: 'medium',
                weight: 'bold'
            }, this.props.campaign[c('AdsAPIAdCampaignFields').NAME]), v ? this.$AdsCMCampaignRedesignedOverview15() : null, v ? null : this.$AdsCMCampaignRedesignedOverview14(), this.$AdsCMCampaignRedesignedOverview10(), this.$AdsCMCampaignRedesignedOverview1(), u ? this.$AdsCMCampaignRedesignedOverview12() : null, u ? this.$AdsCMCampaignRedesignedOverview11() : null, u ? this.$AdsCMCampaignRedesignedOverview13() : null, this.$AdsCMCampaignRedesignedOverview9(), this.$AdsCMCampaignRedesignedOverview3(), u ? null : this.$AdsCMCampaignRedesignedOverview8(), this.$AdsCMCampaignRedesignedOverview6(), this.$AdsCMCampaignRedesignedOverview5(), w && !u ? this.$AdsCMCampaignRedesignedOverview7() : null));
        };
        r.propTypes = {
            adgroupsCount: q.number.isRequired,
            adgroupsMetadata: q.arrayOf(q.any).isRequired,
            bidType: q.string,
            campaign: q.object.isRequired,
            canWrite: q.bool.isRequired,
            currency: q.string.isRequired,
            eligibleUsersCount: q.number.isRequired,
            facebookReachEstimate: q.object,
            hasRules: q.bool.isRequired,
            instagramReachEstimate: q.object,
            isRFCampaign: q.bool.isRequired,
            isSplitTestActive: q.bool,
            mooDefaultConversionBid: q.number.isRequired,
            objective: q.oneOf(Object.keys(c('AdsAPIObjectives'))).isRequired,
            page: q.object,
            redesignedReachPredictionsQE: q.object,
            rfPrediction: q.object,
            showReachEstimate: q.bool.isRequired,
            targetingSentenceLines: q.array,
            timezoneID: q.number.isRequired,
            whitelistedRuleDialogTypes: q.array.isRequired
        };
        l = babelHelpers.inherits(s, c('React').Component);
        m = l && l.prototype;
        s.prototype.render = function () {
            if (this.props.sentenceLines.length === 0)return null;
            var t = "_3rih";
            if (this.props.ellipsize)t = c('joinClasses')(t, "ellipsis");
            var u = this.props.sentenceLines.map(function (v, w) {
                return (c('React').createElement('div', {
                    className: t,
                    key: w + '.' + v.content
                }, i._("{Setting name e.g. 'Location:'} {List of targeting setting values e.g. 'Poland, Brazil'}", [i.param('Setting name e.g. \'Location:\'', c('React').createElement('span', {className: "_50f8"}, v.content)), i.param('List of targeting setting values e.g. \'Poland, Brazil\'', c('intlList')(v.children, c('intlList').CONJUNCTIONS.NONE))])));
            });
            return (c('React').createElement('div', null, u));
        };
        function s() {
            l.apply(this, arguments);
        }

        s.propTypes = {ellipsize: q.bool, sentenceLines: q.array.isRequired};
        f.exports = r;
    }), null);

__d('aggregateCampaignSpecs', ['AdsAggregateCampaignSchema', 'AdsBulkValueUtils'],
    (function a(b, c, d, e, f, g) {
        'use strict';
        function h(i) {
            return c('AdsBulkValueUtils').aggregateDeep(c('AdsAggregateCampaignSchema'), i);
        }

        f.exports = h;
    }), null);

__d('AdsBulkValueUtils', ['invariant', 'AdsBulkValue', 'AdsBulkValueTypes', 'AdsBulkValueTypesConfig', 'AdsEmptyValue', 'AdsMixedValue', 'AdsPropTypes', 'AdsUniformValue', 'ImmutableObject', 'React', 'Set', 'StrSet', 'areEqual', 'areSpecsEqual', 'curry', 'emptyFunction', 'getByPath', 'mapObject', 'setByPath'], (function a(b, c, d, e, f, g, h) {
    'use strict';
    var i = c('React').PropTypes, j = [], k = new (c('ImmutableObject'))(), l = {
        aggregateDeep: v,
        aggregate: u,
        areObjectsEqual: ja,
        areValuesEqual: ia,
        assertAllOrNothingNull: m,
        assertAllSameLength: n,
        cleanBulkSpec: xa,
        createAggregator: ya,
        createDeepAggregator: za,
        deaggregateDeep: w,
        deaggregateDeepByID: x,
        deaggregateDeepByIDToMap: y,
        getFieldPaths: ka,
        getObjectDiff: la,
        getObjectDeepChanges: ma,
        getUniformValue: s,
        getUniformValueDeep: t,
        getValue: ta,
        getValueDeepAt: ua,
        getValueOrMixed: r,
        hasBulkValue: qa,
        isNullValue: ha,
        areBulkValuesEqual: ra,
        hasValueDeep: sa,
        schemaToShape: aa,
        stringifyReplacer: o,
        parallelIterator: p,
        traverseSpec: wa,
        wrapValue: va,
        mergeBulkValues: ba,
        mapBulkValue: q,
        MIXED_VALUE: k
    };

    function m(ab) {
        var bb = ab.filter(ha);
        bb.length === 0 || bb.length == ab.length || h(0);
    }

    function n(ab) {
        var bb = ab.filter(function (db) {
            return db instanceof c('AdsMixedValue');
        }), cb = bb[0] ? bb[0].getValues().length : 0;
        bb.forEach(function (db) {
            db.getValues().length === cb || h(0);
        });
    }

    function o(ab, bb) {
        if (ha(bb))return undefined;
        if (bb instanceof c('AdsUniformValue'))return bb.getValue();
        if (bb instanceof c('AdsMixedValue'))return bb.getValues();
        return bb;
    }

    function p(ab, bb) {
        var cb, db = [], eb = bb.reduce(function (hb, ib) {
            return Math.max(hb, ib.getValues().length);
        }, 0), fb = function hb(ib) {
            db.push(ab(bb.map(function (jb) {
                return jb.getValueForIndex(ib);
            })));
        };
        for (var gb = 0; gb < eb; gb++)fb(gb);
        return l.aggregate(c('AdsBulkValueTypesConfig').UNIFORM_OR_MIXED, db);
    }

    function q(ab, bb) {
        return l.aggregate(c('AdsBulkValueTypesConfig').EMPTY_UNIFORM_MIXED, ab.getValues().map(bb));
    }

    function r(ab) {
        if (ab instanceof c('AdsUniformValue')) {
            return ab.getValue();
        } else if (ab instanceof c('AdsMixedValue'))return k;
        throw new Error('Unknown value type');
    }

    function s(ab, bb) {
        if (ab instanceof c('AdsUniformValue')) {
            return ab.getValue();
        } else return bb;
    }

    function t(ab, bb, cb) {
        if (!ab)return cb;
        var db = l.deaggregateDeep(ab, bb);
        if (db.length <= 1)return db[0];
        var eb = db[0];
        if (db.every(function (fb) {
                return c('areEqual')(fb, eb);
            })) {
            return eb;
        } else return cb;
    }

    function u(ab, bb) {
        var cb;
        ab.getTypes().some(function (db) {
            cb = db.create(bb);
            if (cb)return true;
        });
        if (cb instanceof c('AdsUniformValue') && !(cb instanceof c('AdsEmptyValue')) && cb.getValue() === undefined)return undefined;
        cb || h(0);
        return cb;
    }

    function v(ab, bb) {
        var cb = c('curry')(fa, bb), db = ca(ab, cb);
        return db;
    }

    function w(ab, bb) {
        var cb = [], db = 0;
        while (db < bb) {
            var eb = {}, fb = c('curry')(ga, eb, db);
            ca(ab, fb);
            cb[db] = eb;
            db++;
        }
        return cb;
    }

    function x(ab) {
        if (!ab.id && !pa(ab))return [];
        ab.id instanceof c('AdsBulkValue') || h(0);
        return w(ab, ab.id.getValues().length);
    }

    function y(ab) {
        var bb = x(ab), cb = {};
        bb.forEach(function (db) {
            cb[db.id] = db;
        });
        return cb;
    }

    var z = c('emptyFunction').thatReturns();
    z.isRequired = c('emptyFunction').thatReturns();
    function aa(ab) {
        return z;
    }

    function ba(ab, bb) {
        var cb = 0;
        bb.forEach(function (eb) {
            if (eb && eb.getValues())cb = Math.max(eb.getValues().length, cb);
        });
        var db = [].fill(undefined, cb);
        bb.filter(function (eb) {
            return eb && eb.getValues();
        }).forEach(function (eb) {
            return eb.getValues().forEach(function (fb, gb) {
                db[gb] = db[gb] || fb;
            });
        });
        return l.aggregate(ab, db);
    }

    function ca(ab, bb) {
        return da(ab, bb, {}, []);
    }

    function da(ab, bb, cb, db) {
        ea(ab) || h(0);
        if (ab instanceof c('AdsBulkValueTypes') || ab instanceof c('AdsBulkValue'))return bb(ab, db);
        for (var eb in ab)if (ab[eb] !== undefined) {
            db.push(eb);
            cb[eb] = da(ab[eb], bb, {}, db);
            db.pop();
        }
        return cb;
    }

    function ea(ab) {
        if (!ab || typeof ab !== 'object' || Array.isArray(ab))return false;
        return true;
    }

    function fa(ab, bb, cb) {
        var db = [], eb = false;
        ab.forEach(function (gb) {
            var hb = c('getByPath')(gb, cb);
            if (hb !== undefined)eb = true;
            db.push(hb);
        });
        var fb;
        bb.getTypes().some(function (gb) {
            if (!eb && gb !== c('AdsEmptyValue'))return false;
            fb = gb.create(db);
            return !!fb;
        });
        if (eb) {
            fb || h(0);
        } else fb === undefined || fb instanceof c('AdsEmptyValue') || h(0);
        return fb;
    }

    function ga(ab, bb, cb, db) {
        var eb = cb.getValueForIndex(bb);
        if (eb !== undefined)c('setByPath')(ab, db, cb.getValueForIndex(bb));
    }

    function ha(ab) {
        return (ab === undefined || ab === null || ab instanceof c('AdsEmptyValue'));
    }

    function ia(ab, bb) {
        if (ab === bb)return true;
        var cb = ha(ab), db = ha(bb);
        if (cb || db)return cb && db;
        var eb = ab instanceof c('AdsBulkValue') ? ab.getValues() : j, fb = bb instanceof c('AdsBulkValue') ? bb.getValues() : j;
        if (eb.length !== fb.length)return false;
        return !fb.some(function (gb, hb) {
            return !c('areSpecsEqual')(gb, eb[hb]);
        });
    }

    function ja(ab, bb, cb) {
        if (ab === bb)return true;
        var db = ha(ab), eb = ha(bb);
        if (db || eb)return db && eb;
        if (!na(ab) || !na(bb))return c('areEqual')(ab, bb);
        var fb = Object.keys(ab).concat(Object.keys(bb));
        fb = new (c('Set'))(fb);
        return Array.from(fb).every(function (gb) {
            if (cb && cb[gb])return true;
            var hb = ab[gb], ib = bb[gb];
            if (hb instanceof c('AdsBulkValue') || ib instanceof c('AdsBulkValue')) {
                if (!ia(hb, ib))return false;
            } else if (!ja(hb, ib))return false;
            return true;
        });
    }

    function ka(ab, bb) {
        var cb = [], db = bb || [];
        Object.keys(ab).forEach(function (eb) {
            var fb = db.concat(eb);
            if (ab[eb] == null || ab[eb] instanceof c('AdsBulkValue')) {
                cb.push(fb);
            } else cb = cb.concat(ka(ab[eb], fb));
        });
        return cb;
    }

    function la(ab, bb, cb) {
        if (ha(ab) || ha(bb))return ab;
        var db = Object.keys(ab).concat(Object.keys(bb));
        db = new (c('Set'))(db);
        var eb = {};
        Array.from(db).forEach(function (fb) {
            if (cb && cb[fb])return;
            var gb = bb[fb], hb = ab[fb];
            if (gb instanceof c('AdsBulkValue') || hb instanceof c('AdsBulkValue')) {
                if (!ia(gb, hb))eb[fb] = hb;
            } else if (!ja(gb, hb))eb[fb] = hb;
        });
        if (ab.id)eb.id = ab.id;
        return eb;
    }

    function ma(ab, bb) {
        if (ha(ab) || ha(bb))return ab;
        var cb = ab, db = bb, eb = Object.keys(cb).concat(Object.keys(db));
        eb = new (c('Set'))(eb);
        var fb = {};
        Array.from(eb).forEach(function (gb) {
            var hb = db[gb], ib = cb[gb];
            if (hb instanceof c('AdsBulkValue') || ib instanceof c('AdsBulkValue')) {
                if (!ia(hb, ib))fb[gb] = {'new': ib, old: hb};
            } else if (na(hb) || na(ib)) {
                var jb = ma(ib, hb);
                if (jb && !oa(jb))fb[gb] = jb;
            }
        });
        if (cb.id)fb.id = cb.id;
        return fb;
    }

    function na(ab) {
        return Object.prototype.toString.call(ab) === '[object Object]';
    }

    function oa(ab) {
        for (var bb in ab)return false;
        return true;
    }

    function pa(ab) {
        var bb, cb;
        for (bb in ab) {
            cb = ab[bb];
            if (cb === undefined || cb instanceof c('AdsEmptyValue'))continue;
            if (cb instanceof c('AdsBulkValue'))return true;
            if (na(cb)) {
                if (pa(cb))return true;
                continue;
            }
            h(0);
        }
        return false;
    }

    function qa(ab) {
        var bb, cb;
        for (bb in ab) {
            cb = ab[bb];
            if (cb === undefined)continue;
            if (cb instanceof c('AdsBulkValue'))return true;
            if (na(cb)) {
                if (qa(cb))return true;
                continue;
            }
            h(0);
        }
        return false;
    }

    function ra(ab, bb) {
        var cb = new (c('StrSet'))(ab.getValues()), db = new (c('StrSet'))(bb.getValues());
        return cb.equals(db);
    }

    function sa(ab, bb) {
        var cb;
        if (bb.length) {
            cb = function db(eb, fb) {
                return !!bb.some(function (gb) {
                    return c('getByPath')(gb, fb) !== undefined;
                });
            };
        } else cb = function db() {
            return false;
        };
        return ca(ab, cb);
    }

    function ta(ab) {
        if (ab instanceof c('AdsUniformValue')) {
            return ab.getValue();
        } else if (ab instanceof c('AdsMixedValue'))return k;
        throw new Error('Unknown value type');
    }

    function ua(ab, bb) {
        var cb = {}, db = c('curry')(ga, cb, bb);
        ca(ab, db);
        return oa(cb) ? undefined : cb;
    }

    function va(ab) {
        if (ab instanceof c('AdsBulkValue'))return ab;
        return new (c('AdsUniformValue'))(ab);
    }

    function wa(ab, bb) {
        Object.keys(ab).forEach(function (cb) {
            if (ab[cb] instanceof c('AdsBulkValue')) {
                bb(ab[cb]);
            } else if (Object.prototype.toString.call(ab[cb]) === '[object Object]')wa(ab[cb], bb);
        });
    }

    function xa(ab) {
        var bb = {}, cb = [], db = function eb(fb) {
            if (fb instanceof c('AdsBulkValue')) {
                if (!ha(fb))c('setByPath')(bb, cb, fb);
            } else if (na(fb))Object.keys(fb).forEach(function (gb) {
                cb.push(gb);
                eb(fb[gb]);
                cb.pop();
            });
        };
        db(ab);
        return new (c('ImmutableObject'))(bb);
    }

    function ya(ab) {
        function bb(cb) {
            return l.aggregate(ab || c('AdsBulkValueTypesConfig').EMPTY_UNIFORM_MIXED, cb);
        }

        return bb;
    }

    function za(ab) {
        return function (bb) {
            return l.aggregateDeep(ab, bb);
        };
    }

    f.exports = l;
}), null);

__d('AdsCMCampaignsOverviewContainer.react', ['cx', 'fbt', 'AdproAccountUserPermission', 'AdsAccountStore', 'AdsAdgroupLiveListStore', 'AdsAdgroupLiveStore', 'AdsAPIAccountPaths', 'AdsAPIAdCampaignFields', 'AdsAPICampaignGroupPaths', 'AdsAPICampaignPaths', 'AdsBlockListAccountListStore', 'AdsBuyingTypes', 'AdsCampaignCombinedStore', 'AdsCampaignGroupLiveStore', 'AdsCampaignLiveStore', 'AdsCMCampaignOverview.react', 'AdsCMCampaignRedesignedOverview.react', 'AdsCMComponentUseBootloaderWithShimMixin', 'AdsCMDimensionStore', 'AdsCML2MigrationUtils', 'AdsCMObjectSimpleStatus.react', 'AdsCMObjectsOverviewActionMenu.react', 'AdsCMOverviewContainerShim.react', 'AdsCMPageStore', 'AdsCMStoreUtil', 'AdsCreateRuleCardStore', 'AdsDuplicateLabelQEStoreUtil', 'AdsInterfacesStoreQE', 'AdsLoadState', 'AdsObjectTypes', 'AdsPageStore', 'AdsPlacementAPISpecReaderUtils', 'AdsPlacementEligibilityInfoUtils', 'AdsPredictedOutcomesPlacementUpsellUtils', 'AdsPredictionStore', 'AdsQEStore', 'AdsReachEstimateStore', 'AdsReachEstimateUtils', 'AdsReachEstimateStoreUtils', 'AdsRuleStoreUtils', 'AdsSplitTestUtils', 'AdsSplitTestValidationUtils', 'AdsTargetingSentenceLinesStore', 'Bootloader', 'FluxMixinLegacy', 'React', 'ReactComponentWithPureRenderMixin', 'adsGKCheck', 'compactArray', 'getByPath'], (function a(b, c, d, e, f, g, h, i) {
    'use strict';
    var j = 5, k = [], l = c('React').createClass({
        displayName: 'AdsCMCampaignsOverviewContainer',
        mixins: [c('AdsCMComponentUseBootloaderWithShimMixin'), c('FluxMixinLegacy')([].concat(c('AdsRuleStoreUtils').stores, [c('AdsAccountStore'), c('AdsAdgroupLiveListStore'), c('AdsBlockListAccountListStore'), c('AdsCampaignCombinedStore'), c('AdsAdgroupLiveStore'), c('AdsCampaignGroupLiveStore'), c('AdsCampaignLiveStore'), c('AdsCMPageStore'), c('AdsReachEstimateStore'), c('AdsCMDimensionStore'), c('AdsCreateRuleCardStore'), c('AdsTargetingSentenceLinesStore')], c('AdsDuplicateLabelQEStoreUtil').getStores())), c('ReactComponentWithPureRenderMixin')],
        statics: {
            bootLoadComponent: function m(n) {
                c('Bootloader').loadModules(["AdsCMInformationPanel.react"], n, 'AdsCMCampaignsOverviewContainer.react');
            }, _getRFPrediction: function m(n) {
                var o = n[c('AdsAPIAdCampaignFields').RF_PREDICTION_ID];
                if (o) {
                    var p = c('AdsPredictionStore').get(o);
                    return p;
                }
                return null;
            }, calculateState: function m() {
                var n, o = this, p = c('AdsAccountStore').getViewerHasPermission(c('AdproAccountUserPermission').ADMANAGER_WRITE),
                    q = c('AdsCMPageStore').getCurrentPageID(), r = c('AdsCMPageStore').getPage(q),
                    s = c('AdsAccountStore').getSelectedAccountID(),
                    t = c('getByPath')(c('AdsAccountStore').getSelectedAccount(), c('AdsAPIAccountPaths').CURRENCY),
                    u = c('AdsAccountStore').getTimezoneID(),
                    v = c('getByPath')(c('AdsAccountStore').getSelectedAccount(), c('AdsAPIAccountPaths').MOO_DEFAULT_CONVERSION_BID),
                    w = void 0, x = c('AdsCMPageStore').getCurrentIDs(q) || [], y = x.map(function (ha) {
                        return c('AdsCampaignLiveStore').getWithExpensiveFields(ha).getValue();
                    }).filter(function (ha) {
                        return !!ha;
                    }), z = c('AdsRuleStoreUtils').getWhitelistedRuleDialogTypes(), aa = void 0, ba = true,
                    ca = false, da = c('AdsQEStore').get(c('AdsPredictedOutcomesPlacementUpsellUtils').QE_NAME, s),
                    ea = !c('AdsPredictedOutcomesPlacementUpsellUtils').getShouldShowRedesign(da);
                if (x.length === 1 || c('adsGKCheck')('ads_cm_show_single_object_info_card')) {
                    (function () {
                        var ha = void 0;
                        if (y.length < 1) {
                            ba = false;
                            w = false;
                        } else aa = c('compactArray')(y.map(function (ia) {
                            if (!ia)return null;
                            ha = ia;
                            var ja = c('getByPath')(ha, c('AdsAPICampaignPaths').CAMPAIGN_ID),
                                ka = c('AdsCampaignGroupLiveStore').get(ja).getValue();
                            w = !c('AdsSplitTestUtils').hasSplitTest(ka);
                            if (!ka) {
                                ba = false;
                            } else {
                                var la = c('AdsSplitTestValidationUtils').isSplitTestActiveForCampaignGroup(ka);
                                ca = ca || la;
                                var ma = c('getByPath')(ka, c('AdsAPICampaignGroupPaths').OBJECTIVE), na = c('getByPath')(ka, c('AdsAPICampaignGroupPaths').BUYING_TYPE) === c('AdsBuyingTypes').RESERVED, oa = ha.targeting || c('AdsCML2MigrationUtils').getChildrenTargetingIfHomogeneous(s, ha, c('AdsAdgroupLiveStore'), c('AdsAdgroupLiveListStore')), pa = void 0;
                                if (oa) {
                                    var qa = c('AdsTargetingSentenceLinesStore').getTargeting(s, oa, {discardPlacement: true});
                                    if (qa.loadState === c('AdsLoadState').LOADED)pa = qa.sentenceLines;
                                }
                                var ra = this._getRFPrediction(ha, s, t), sa = c('AdsReachEstimateStoreUtils').getReachEstimateByPlatform(ha, s, t, false), ta = c('AdsAdgroupLiveListStore').getForCampaign(s, ha.id).list, ua = [], va = ta.length;
                                if (va > j)ta = ta.slice(0, j);
                                ua = ta.map(function (hb) {
                                    return (c('AdsAdgroupLiveStore').get(hb).getValue());
                                }).filter(function (hb) {
                                    return !!hb;
                                });
                                var wa = ha.bid_type || c('AdsCML2MigrationUtils').getChildrenBidTypeIfHomogeneous(s, ha, c('AdsAdgroupLiveStore'), c('AdsAdgroupLiveListStore')), xa = c('getByPath')(ha, c('AdsAPICampaignPaths').PROMOTED_OBJECT.PAGE_ID), ya = xa ? c('AdsPageStore').get(xa) : undefined, za = 0, ab = c('AdsBlockListAccountListStore').get(s);
                                if (!ab.isDone()) {
                                    ba = false;
                                } else {
                                    var bb = c('getByPath')(ha, c('AdsAPICampaignPaths').PROMOTED_OBJECT.OBJECT_STORE_URL), cb = c('AdsPlacementEligibilityInfoUtils').buildEligibilityInformationFromCampaignSpec(ha, c('getByPath')(ka, c('AdsAPICampaignGroupPaths').BUYING_TYPE), c('getByPath')(c('AdsAccountStore').getSelectedAccount(), c('AdsAPIAccountPaths').CAPABILITIES), ma, ab.getValue() || [], bb), db = c('AdsPlacementAPISpecReaderUtils').getAllEligiblePlacementsSpec(cb), eb = Object.assign({}, oa, db), fb = c('getByPath')(ha, c('AdsAPICampaignPaths').OPTIMIZATION_GOAL), gb = c('AdsReachEstimateStore').getReachEstimateForCampaignOrAccount(ha.id, s, t, eb, null, fb, bb);
                                    za = c('AdsReachEstimateUtils').getUsers(gb);
                                }
                                return (c('React').createElement(c('AdsCMCampaignRedesignedOverview.react'), {
                                    adgroupsCount: va,
                                    adgroupsMetadata: ua,
                                    bidType: wa,
                                    campaign: ha,
                                    canWrite: p,
                                    currency: t,
                                    eligibleUsersCount: za,
                                    facebookReachEstimate: sa.facebook,
                                    hasClosedRuleCardLoadObject: c('AdsCreateRuleCardStore').getHasClosedRuleCard(),
                                    hasRules: c('AdsRuleStoreUtils').getHasRules(),
                                    instagramReachEstimate: sa.instagram,
                                    isRFCampaign: na,
                                    isSplitTestActive: la,
                                    mooDefaultConversionBid: v,
                                    objective: ma,
                                    page: ya,
                                    redesignedReachPredictionsQE: da,
                                    rfPrediction: ra,
                                    showReachEstimate: ea,
                                    targetingSentenceLines: pa,
                                    timezoneID: u,
                                    whitelistedRuleDialogTypes: z
                                }));
                            }
                            return null;
                        }.bind(o)));
                    })();
                } else {
                    w = true;
                    aa = x.map(function (ha) {
                        if (!ba)return null;
                        var ia = c('AdsCampaignLiveStore').getWithExpensiveFields(ha).getValue();
                        if (!ia) {
                            ba = false;
                            return null;
                        }
                        var ja = c('getByPath')(ia, c('AdsAPICampaignPaths').CAMPAIGN_ID), ka = c('AdsCampaignGroupLiveStore').get(ja).getValue();
                        w = w && !c('AdsSplitTestUtils').hasSplitTest(ka);
                        if (!ka) {
                            ba = false;
                            return null;
                        }
                        var la = c('getByPath')(ka, c('AdsAPICampaignGroupPaths').SPLIT_TEST_CONFIG.path), ma = c('AdsSplitTestValidationUtils').isSplitTestActive(la);
                        ca = ca || ma;
                        var na = c('getByPath')(ka, c('AdsAPICampaignGroupPaths').OBJECTIVE), oa = ia.targeting || c('AdsCML2MigrationUtils').getChildrenTargetingIfHomogeneous(s, ia, c('AdsAdgroupLiveStore'), c('AdsAdgroupLiveListStore')), pa = void 0;
                        if (oa) {
                            var qa = c('AdsTargetingSentenceLinesStore').getTargeting(s, oa, {discardPlacement: true});
                            if (qa.loadState === c('AdsLoadState').LOADED) {
                                pa = qa.sentenceLines;
                            } else {
                                ba = false;
                                return null;
                            }
                        }
                        var ra = c('AdsReachEstimateStoreUtils').getReachEstimateByPlatform(ia, s, t, false), sa = ia.bid_type || c('AdsCML2MigrationUtils').getChildrenBidTypeIfHomogeneous(s, ia, c('AdsAdgroupLiveStore'), c('AdsAdgroupLiveListStore'));
                        return (c('React').createElement(c('AdsCMCampaignOverview.react'), {
                            bidType: sa,
                            campaignSpec: ia,
                            canWrite: p,
                            currency: t,
                            facebookReachEstimate: ra.facebook,
                            hasClosedRuleCardLoadObject: c('AdsCreateRuleCardStore').getHasClosedRuleCard(),
                            hasRules: c('AdsRuleStoreUtils').getHasRules(),
                            instagramReachEstimate: ra.instagram,
                            isSplitTestActive: ma,
                            mooDefaultConversionBid: v,
                            objective: na,
                            showHeader: x.length > 1,
                            showReachEstimate: ea,
                            targetingSentenceLines: pa,
                            timezoneID: u,
                            whitelistedRuleDialogTypes: z
                        }));
                    });
                }
                var fa = c('AdsAccountStore').getViewerPermissions(), ga = [];
                if (fa.loadState === c('AdsLoadState').LOADED)ga = fa.data;
                return {
                    canCreateSimilar: w,
                    content: ba ? aa : k,
                    gridSize: c('AdsCMDimensionStore').getGridSize(),
                    isUsingDuplicateLabel: c('AdsDuplicateLabelQEStoreUtil').isDuplicateLabelEnabled(),
                    isSplitTestActive: ca,
                    objectIDs: x,
                    objects: y,
                    page: r,
                    ready: ba,
                    userPermissions: ga
                };
            }
        },
        renderShim: function m() {
            return c('React').createElement(c('AdsCMOverviewContainerShim.react'), this.state);
        },
        renderBootloadedComponent: function m(n) {
            var o = void 0, p = c('AdsCMStoreUtil').fillParentObjectForCampaigns(this.state.objects);
            if (this.state.objects.length === 1)o = c('React').createElement(c('AdsCMObjectSimpleStatus.react'), {
                className: "_33kd",
                disableToggle: this.state.isSplitTestActive,
                object: p[0],
                objectType: c('AdsObjectTypes').CAMPAIGN
            });
            var q = void 0;
            if (!this.state.isSplitTestActive)q = c('React').createElement(c('AdsCMObjectsOverviewActionMenu.react'), {
                canCreateSimilar: this.state.canCreateSimilar,
                isUsingDuplicateLabel: this.state.isUsingDuplicateLabel,
                objectType: c('AdsObjectTypes').CAMPAIGN,
                objects: p,
                userPermissions: this.state.userPermissions
            });
            return (c('React').createElement(n, {
                actionMenu: q,
                content: this.state.content,
                gridSize: this.state.gridSize,
                page: this.state.page,
                status: o,
                title: this._getTitle(this.state.content)
            }));
        },
        _getTitle: function m(n) {
            if (n.length === 1) {
                return i._("Ad Set");
            } else return i._("Ad Sets Settings");
        }
    });
    f.exports = l;
}), null);

__d('AdsReachEstimateStoreUtils', ['AdsAPIAdCampaignFields', 'AdsInstagramApplicabilityUtils', 'AdsInstagramPlacementUtils', 'AdsPlacementAPISpecReaderUtils', 'AdsReachEstimateStore', 'LoadObject'], (function a(b, c, d, e, f, g) {
    'use strict';
    var h = {
        getReachEstimate: function i(j, k, l, m) {
            return c('AdsReachEstimateStore').getReachEstimateForCampaignOrAccount(j.id, k, l, j.targeting, null, j[c('AdsAPIAdCampaignFields').OPTIMIZATION_GOAL], j.promoted_object ? j.promoted_object.object_store_url : null, null, m);
        }, getReachEstimateByPlatform: function i(j, k, l, m) {
            var n = void 0, o, p;
            if (j.targeting) {
                n = j[c('AdsAPIAdCampaignFields').OPTIMIZATION_GOAL];
                if (!c('AdsInstagramApplicabilityUtils').hasInstagramPlacementOnly(j))
                    o = c('AdsReachEstimateStore').getReachEstimateForCampaignOrAccount(j.id, k, l, c('AdsInstagramPlacementUtils').cloneTargetingWithoutInstagramPlacement(j.targeting), null, n, j.promoted_object ? j.promoted_object.object_store_url : null, null, m);
                if (c('AdsInstagramApplicabilityUtils').hasInstagramPlacement(j)) {
                    var q = c('AdsPlacementAPISpecReaderUtils').keepInstagramOnlyInTargetingSpec(j.targeting);
                    p = c('AdsReachEstimateStore').getReachEstimateForCampaignOrAccount(j.id, k, l, q, null, n, j.promoted_object ? j.promoted_object.object_store_url : null, null, m);
                }
            }
            return {facebook: o, instagram: p};
        }
    };
    f.exports = h;
}), null);

