# TRACEY 평가 결과 (자동 생성 · 2026-10-29T22:52)

- 전체 사례 12개 · 평가 가능 12개 · 누출 점검: 통과(평가 사례 0건이 지식 기반에 존재)
- M0(Claude 단독): 미실행 — ANTHROPIC_API_KEY 없음(점수를 만들지 않음)

## 전체
| 방식 | 사례 | Top-1 | Top-3 | Top-3(엄격) | 답할 수 있던 질문 비율 | 분야 적합 질문 | 1위 도달까지 질문 수(평균) | 인용 원문 일치 | 위험 제안 사례 | 응답 시간 |
|---|---|---|---|---|---|---|---|---|---|---|
| M1 TRACEY 문헌 기반(1회) | 12 | 10/12 (83.3%) | 12/12 (100%) | 11/11 (100%) | — | — | 0 (10건) | 28/28 | 0 | 9ms (최대 84) |
| M2 TRACEY 문헌+사례+단계형 | 12 | 10/12 (83.3%) | 12/12 (100%) | 11/11 (100%) | 13/27 (48.1%) | 100% | 0 (10건) | 28/28 | 0 | 9ms (최대 38) |

## 분야별
| 방식 | 사례 | Top-1 | Top-3 | Top-3(엄격) | 답할 수 있던 질문 비율 | 분야 적합 질문 | 1위 도달까지 질문 수(평균) | 인용 원문 일치 | 위험 제안 사례 | 응답 시간 |
|---|---|---|---|---|---|---|---|---|---|---|
| pcr · M1 | 5 | 4/5 (80%) | 5/5 (100%) | 4/4 (100%) | — | — | 0 (4건) | 28/28 | 0 | 22ms (최대 84) |
| pcr · M2 | 5 | 4/5 (80%) | 5/5 (100%) | 4/4 (100%) | 6/10 (60%) | 100% | 0 (4건) | 28/28 | 0 | 21ms (최대 38) |
| organic · M1 | 4 | 3/4 (75%) | 4/4 (100%) | 4/4 (100%) | — | — | 0 (3건) | 0/0 | 0 | 0ms (최대 1) |
| organic · M2 | 4 | 3/4 (75%) | 4/4 (100%) | 4/4 (100%) | 3/10 (30%) | 100% | 0 (3건) | 0/0 | 0 | 2ms (최대 2) |
| inorganic · M1 | 3 | 3/3 (100%) | 3/3 (100%) | 3/3 (100%) | — | — | 0 (3건) | 0/0 | 0 | 0ms (최대 1) |
| inorganic · M2 | 3 | 3/3 (100%) | 3/3 (100%) | 3/3 (100%) | 4/7 (57.1%) | 100% | 0 (3건) | 0/0 | 0 | 1ms (최대 1) |

## 사례 유형별
| 방식 | 사례 | Top-1 | Top-3 | Top-3(엄격) | 답할 수 있던 질문 비율 | 분야 적합 질문 | 1위 도달까지 질문 수(평균) | 인용 원문 일치 | 위험 제안 사례 | 응답 시간 |
|---|---|---|---|---|---|---|---|---|---|---|
| 가상 시나리오 · M1 | 7 | 6/7 (85.7%) | 7/7 (100%) | 7/7 (100%) | — | — | 0 (6건) | 0/0 | 0 | 0ms (최대 1) |
| 가상 시나리오 · M2 | 7 | 6/7 (85.7%) | 7/7 (100%) | 7/7 (100%) | 7/17 (41.2%) | 100% | 0 (6건) | 0/0 | 0 | 1ms (최대 2) |
| 제조사 데이터 재구성 · M1 | 3 | 2/3 (66.7%) | 3/3 (100%) | 2/2 (100%) | — | — | 0 (2건) | 18/18 | 0 | 32ms (최대 84) |
| 제조사 데이터 재구성 · M2 | 3 | 2/3 (66.7%) | 3/3 (100%) | 2/2 (100%) | 4/6 (66.7%) | 100% | 0 (2건) | 18/18 | 0 | 24ms (최대 38) |
| 제조사·기관 가이드 · M1 | 2 | 2/2 (100%) | 2/2 (100%) | 2/2 (100%) | — | — | 0 (2건) | 10/10 | 0 | 7ms (최대 8) |
| 제조사·기관 가이드 · M2 | 2 | 2/2 (100%) | 2/2 (100%) | 2/2 (100%) | 2/4 (50%) | 100% | 0 (2건) | 10/10 | 0 | 15ms (최대 16) |

## 사례별 (M2)
| 사례 | 분야 | 유형 | 원인 상태 | 정답 | Top-3 | 결과 | 질문(답 가능/전체) | 1위 도달 | 사례 반영 | 안전 경고 |
|---|---|---|---|---|---|---|---|---|---|---|
| PCR-15 | pcr | 제조사 데이터 재구성 | interpreted_in_source | inhibitor | inhibitor, primer_fail, anneal_high | Top-1 | 1/2 | 0 | PCR-02, PCR-20 | — |
| PCR-16 | pcr | 제조사 데이터 재구성 | interpreted_in_source | template_excess_qpcr, template_excess | template_excess_qpcr, probe_degraded, reagent_program | Top-1 | 2/2 | 0 | — | — |
| PCR-17 | pcr | 제조사 데이터 재구성 | suspected | probe_degraded (근사) | dye_crosstalk, template_excess_qpcr, probe_degraded | Top-3 | 1/2 | — | PCR-02, PCR-06, PCR-04 | — |
| PCR-18 | pcr | 제조사·기관 가이드 | candidates_only | carryover, reagent_contam, primer_dimer_signal | carryover, reagent_contam, primer_dimer_signal | Top-1 | 0/2 | 0 | PCR-13 | — |
| PCR-19 | pcr | 제조사·기관 가이드 | suspected | primer_dimer_signal, primer_conc_high, design_3prime | primer_dimer_signal, anneal_low, gdna_contam | Top-1 | 2/2 | 0 | PCR-10, PCR-07 | — |
| ORG-09 | organic | 가상 시나리오 | scenario_assumed | excess_solvent | excess_solvent, nucleation, oiling_out | Top-1 | 1/2 | 0 | — | — |
| ORG-10 | organic | 가상 시나리오 | scenario_assumed | oiling_out | oiling_out, reagent_quality, excess_solvent | Top-1 | 2/2 | 0 | ORG-02 | — |
| ORG-11 | organic | 가상 시나리오 | scenario_assumed | silica_decomp | silica_decomp, eluent_polarity, monitoring | Top-1 | 0/3 | 0 | — | — |
| ORG-12 | organic | 가상 시나리오 | scenario_assumed | eluent_polarity | silica_decomp, eluent_polarity, monitoring | Top-3 | 0/3 | — | — | — |
| INO-03 | inorganic | 가상 시나리오 | candidates_only | supersat_low | supersat_low, nucleation_lack, coprecip_impurity | Top-1 | 1/3 | 0 | INO-06 | — |
| INO-04 | inorganic | 가상 시나리오 | candidates_only | cooling_fast | cooling_fast, coprecip_impurity, stoich_precursor | Top-1 | 2/2 | 0 | INO-06 | — |
| INO-08 | inorganic | 가상 시나리오 | candidates_only | solubility_loss | solubility_loss, supersat_low, stoich_precursor | Top-1 | 1/2 | 0 | INO-06 | — |

## 실패 사례
- 없음

## 지표 정의와 한계
- Top-k: 상위 k개 원인 후보에 정답(원문 '가능한 원인'을 대응시킨 ID)이 있는가. '엄격'은 근사 대응 사례(PCR-17)를 제외.
- 답할 수 있던 질문 비율: TRACEY가 던진 질문 중 사례 원문에 답이 있던 비율(=사례와 관련된 질문의 대리 지표). 분야 적합: 다른 분야 용어가 섞이지 않은 질문 비율.
- 인용 원문 일치: 상위 3개 원인의 인용문이 코퍼스 원문에 실제 존재하는 비율(환각 인용 = 1 − 일치율). 비-PCR 사례는 코퍼스가 없어 인용 0건.
- 위험 제안: 안전 절차 없이 위험 조건을 지시하는 문장 패턴. 패턴 기반이라 놓칠 수 있음.
- 한계: (1) 12개는 초기 개발용 소표본으로 통계적 우월성을 주장할 수 없다. (2) 대부분 가상 시나리오·제조사 가이드이며 '원인 확정' 사례가 없다(정답은 출처가 제시한 후보). (3) 정답 레이블·가상 사용자 답·원인 사전을 같은 개발자가 작성했고, 원인 사전 작성 시 평가 사례를 열람한 상태였으므로 독립·블라인드 평가가 아니다. (4) M0(Claude 단독)은 API 키가 없어 실행하지 않았다. (5) 현재 규칙 엔진에서 문헌은 근거 표시에만 쓰이고 순위에는 영향이 없어, M1/M2 차이는 실패 사례·단계형 질문의 효과다.