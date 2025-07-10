# swagger 공유용 서버 수정시 heroku로 커밋 필요
- heroku 로그확인
heroku logs --tail

- heroku 재배포 -
git add .
git commit -m "배포용 수정"
git push heroku main
