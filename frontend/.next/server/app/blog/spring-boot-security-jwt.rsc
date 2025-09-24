2:I[1344,["518","static/chunks/518-db630b946e945006.js","481","static/chunks/481-ca005a81abcbc31c.js","308","static/chunks/app/blog/%5Bslug%5D/page-f925cf69c09ee81c.js"],"default"]
4:I[893,["518","static/chunks/518-db630b946e945006.js","481","static/chunks/481-ca005a81abcbc31c.js","308","static/chunks/app/blog/%5Bslug%5D/page-f925cf69c09ee81c.js"],"default"]
6:I[4297,["518","static/chunks/518-db630b946e945006.js","481","static/chunks/481-ca005a81abcbc31c.js","308","static/chunks/app/blog/%5Bslug%5D/page-f925cf69c09ee81c.js"],"default"]
7:I[4707,[],""]
9:I[6423,[],""]
a:I[8596,["185","static/chunks/app/layout-563ec2edc9a48b24.js"],"LanguageProvider"]
3:T2ea5,<br/># Spring Boot에서 JWT 인증 구현하기<br/><br/>JWT(JSON Web Token)는 현대 웹 애플리케이션에서 인증을 처리하는 표준 방법 중 하나입니다. 이 포스트에서는 Spring Boot와 Spring Security를 사용하여 JWT 기반 인증 시스템을 구현하는 방법을 단계별로 알아보겠습니다.<br/><br/>## JWT란 무엇인가?<br/><br/>JWT는 두 당사자 간에 안전하게 정보를 전송하기 위한 컴팩트하고 자체 포함된 방식입니다. 토큰은 세 부분으로 구성됩니다:<br/><br/>- **Header**: 토큰 타입과 해싱 알고리즘<br/>- **Payload**: 클레임(사용자 정보) 포함<br/>- **Signature**: 토큰의 무결성 검증<br/><br/>## 의존성 설정<br/><br/>먼저 필요한 의존성을 `pom.xml`에 추가합니다.<br/><br/>```xml<br/><dependencies><br/>    <dependency><br/>        <groupId>org.springframework.boot</groupId><br/>        <artifactId>spring-boot-starter-web</artifactId><br/>    </dependency><br/>    <dependency><br/>        <groupId>org.springframework.boot</groupId><br/>        <artifactId>spring-boot-starter-security</artifactId><br/>    </dependency><br/>    <dependency><br/>        <groupId>org.springframework.boot</groupId><br/>        <artifactId>spring-boot-starter-data-jpa</artifactId><br/>    </dependency><br/>    <dependency><br/>        <groupId>io.jsonwebtoken</groupId><br/>        <artifactId>jjwt-api</artifactId><br/>        <version>0.11.5</version><br/>    </dependency><br/>    <dependency><br/>        <groupId>io.jsonwebtoken</groupId><br/>        <artifactId>jjwt-impl</artifactId><br/>        <version>0.11.5</version><br/>    </dependency><br/>    <dependency><br/>        <groupId>io.jsonwebtoken</groupId><br/>        <artifactId>jjwt-jackson</artifactId><br/>        <version>0.11.5</version><br/>    </dependency><br/></dependencies><br/>```<br/><br/>## JWT 유틸리티 클래스 구현<br/><br/>```java<br/>@Component<br/>public class JwtUtil {<br/><br/>    private final String SECRET_KEY = "mySecretKey";<br/>    private final int JWT_EXPIRATION = 86400000; // 24시간<br/><br/>    public String generateToken(UserDetails userDetails) {<br/>        Map<String, Object> claims = new HashMap<>();<br/>        return createToken(claims, userDetails.getUsername());<br/>    }<br/><br/>    private String createToken(Map<String, Object> claims, String subject) {<br/>        return Jwts.builder()<br/>                .setClaims(claims)<br/>                .setSubject(subject)<br/>                .setIssuedAt(new Date(System.currentTimeMillis()))<br/>                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))<br/>                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)<br/>                .compact();<br/>    }<br/><br/>    public Boolean validateToken(String token, UserDetails userDetails) {<br/>        final String username = extractUsername(token);<br/>        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));<br/>    }<br/><br/>    public String extractUsername(String token) {<br/>        return extractClaim(token, Claims::getSubject);<br/>    }<br/><br/>    public Date extractExpiration(String token) {<br/>        return extractClaim(token, Claims::getExpiration);<br/>    }<br/><br/>    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {<br/>        final Claims claims = extractAllClaims(token);<br/>        return claimsResolver.apply(claims);<br/>    }<br/><br/>    private Claims extractAllClaims(String token) {<br/>        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();<br/>    }<br/><br/>    private Boolean isTokenExpired(String token) {<br/>        return extractExpiration(token).before(new Date());<br/>    }<br/>}<br/>```<br/><br/>## JWT 요청 필터 구현<br/><br/>```java<br/>@Component<br/>public class JwtRequestFilter extends OncePerRequestFilter {<br/><br/>    @Autowired<br/>    private UserDetailsService userDetailsService;<br/><br/>    @Autowired<br/>    private JwtUtil jwtUtil;<br/><br/>    @Override<br/>    protected void doFilterInternal(HttpServletRequest request,<br/>                                   HttpServletResponse response,<br/>                                   FilterChain chain) throws ServletException, IOException {<br/><br/>        final String requestTokenHeader = request.getHeader("Authorization");<br/><br/>        String username = null;<br/>        String jwtToken = null;<br/><br/>        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {<br/>            jwtToken = requestTokenHeader.substring(7);<br/>            try {<br/>                username = jwtUtil.extractUsername(jwtToken);<br/>            } catch (IllegalArgumentException e) {<br/>                System.out.println("Unable to get JWT Token");<br/>            } catch (ExpiredJwtException e) {<br/>                System.out.println("JWT Token has expired");<br/>            }<br/>        }<br/><br/>        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {<br/>            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);<br/><br/>            if (jwtUtil.validateToken(jwtToken, userDetails)) {<br/>                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =<br/>                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());<br/>                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));<br/>                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);<br/>            }<br/>        }<br/>        chain.doFilter(request, response);<br/>    }<br/>}<br/>```<br/><br/>## Security 구성<br/><br/>```java<br/>@EnableWebSecurity<br/>@Configuration<br/>public class SecurityConfig {<br/><br/>    @Autowired<br/>    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;<br/><br/>    @Autowired<br/>    private JwtRequestFilter jwtRequestFilter;<br/><br/>    @Bean<br/>    public PasswordEncoder passwordEncoder() {<br/>        return new BCryptPasswordEncoder();<br/>    }<br/><br/>    @Bean<br/>    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {<br/>        return config.getAuthenticationManager();<br/>    }<br/><br/>    @Bean<br/>    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {<br/>        http.csrf().disable()<br/>            .authorizeHttpRequests(authz -> authz<br/>                .requestMatchers("/api/auth/**").permitAll()<br/>                .anyRequest().authenticated()<br/>            )<br/>            .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint)<br/>            .and()<br/>            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);<br/><br/>        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);<br/><br/>        return http.build();<br/>    }<br/>}<br/>```<br/><br/>## 인증 컨트롤러<br/><br/>```java<br/>@RestController<br/>@RequestMapping("/api/auth")<br/>public class AuthController {<br/><br/>    @Autowired<br/>    private AuthenticationManager authenticationManager;<br/><br/>    @Autowired<br/>    private UserDetailsService userDetailsService;<br/><br/>    @Autowired<br/>    private JwtUtil jwtUtil;<br/><br/>    @PostMapping("/login")<br/>    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {<br/>        try {<br/>            authenticationManager.authenticate(<br/>                new UsernamePasswordAuthenticationToken(<br/>                    loginRequest.getUsername(),<br/>                    loginRequest.getPassword()<br/>                )<br/>            );<br/>        } catch (BadCredentialsException e) {<br/>            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)<br/>                .body(new ErrorResponse("Invalid credentials"));<br/>        }<br/><br/>        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());<br/>        final String jwt = jwtUtil.generateToken(userDetails);<br/><br/>        return ResponseEntity.ok(new JwtResponse(jwt));<br/>    }<br/><br/>    @PostMapping("/register")<br/>    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {<br/>        // 사용자 등록 로직<br/>        // 비밀번호 암호화, 데이터베이스 저장 등<br/>        return ResponseEntity.ok(new MessageResponse("User registered successfully"));<br/>    }<br/>}<br/>```<br/><br/>## 사용자 엔티티와 서비스<br/><br/>```java<br/>@Entity<br/>@Table(name = "users")<br/>public class User {<br/>    @Id<br/>    @GeneratedValue(strategy = GenerationType.IDENTITY)<br/>    private Long id;<br/><br/>    @Column(unique = true)<br/>    private String username;<br/><br/>    private String password;<br/><br/>    private String email;<br/><br/>    @Enumerated(EnumType.STRING)<br/>    private Set<Role> roles = new HashSet<>();<br/><br/>    // getters and setters<br/>}<br/><br/>@Service<br/>public class UserDetailsServiceImpl implements UserDetailsService {<br/><br/>    @Autowired<br/>    private UserRepository userRepository;<br/><br/>    @Override<br/>    @Transactional<br/>    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {<br/>        User user = userRepository.findByUsername(username)<br/>            .orElseThrow(() -> new UsernameNotFoundException("User Not Found: " + username));<br/><br/>        return UserPrincipal.create(user);<br/>    }<br/>}<br/>```<br/><br/>## 보안 고려사항<br/><br/>1. **시크릿 키 관리**: 환경변수나 외부 설정 파일에서 관리<br/>2. **토큰 만료**: 적절한 만료 시간 설정<br/>3. **리프레시 토큰**: 장기간 인증을 위한 리프레시 토큰 구현<br/>4. **토큰 블랙리스트**: 로그아웃된 토큰 무효화<br/>5. **HTTPS**: 토큰 전송 시 HTTPS 사용 필수<br/><br/>## 테스트<br/><br/>```java<br/>@SpringBootTest<br/>@AutoConfigureTestDatabase<br/>class JwtAuthenticationTest {<br/><br/>    @Autowired<br/>    private TestRestTemplate restTemplate;<br/><br/>    @Test<br/>    void testLoginAndAccessProtectedResource() {<br/>        // 로그인 테스트<br/>        LoginRequest loginRequest = new LoginRequest("testuser", "password");<br/>        ResponseEntity<JwtResponse> loginResponse = restTemplate.postForEntity(<br/>            "/api/auth/login", loginRequest, JwtResponse.class);<br/><br/>        assertEquals(HttpStatus.OK, loginResponse.getStatusCode());<br/>        assertNotNull(loginResponse.getBody().getToken());<br/><br/>        // 보호된 리소스 접근 테스트<br/>        HttpHeaders headers = new HttpHeaders();<br/>        headers.setBearerAuth(loginResponse.getBody().getToken());<br/>        HttpEntity<String> entity = new HttpEntity<>(headers);<br/><br/>        ResponseEntity<String> response = restTemplate.exchange(<br/>            "/api/protected", HttpMethod.GET, entity, String.class);<br/><br/>        assertEquals(HttpStatus.OK, response.getStatusCode());<br/>    }<br/>}<br/>```<br/><br/>## 마무리<br/><br/>JWT를 사용한 인증 시스템은 확장성과 성능 면에서 많은 장점을 제공합니다. 하지만 토큰 관리와 보안에 각별한 주의가 필요합니다.<br/><br/>다음 포스트에서는 OAuth2와 소셜 로그인 구현에 대해 알아보겠습니다.5:T29a5,
# Spring Boot에서 JWT 인증 구현하기

JWT(JSON Web Token)는 현대 웹 애플리케이션에서 인증을 처리하는 표준 방법 중 하나입니다. 이 포스트에서는 Spring Boot와 Spring Security를 사용하여 JWT 기반 인증 시스템을 구현하는 방법을 단계별로 알아보겠습니다.

## JWT란 무엇인가?

JWT는 두 당사자 간에 안전하게 정보를 전송하기 위한 컴팩트하고 자체 포함된 방식입니다. 토큰은 세 부분으로 구성됩니다:

- **Header**: 토큰 타입과 해싱 알고리즘
- **Payload**: 클레임(사용자 정보) 포함
- **Signature**: 토큰의 무결성 검증

## 의존성 설정

먼저 필요한 의존성을 `pom.xml`에 추가합니다.

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
    </dependency>
</dependencies>
```

## JWT 유틸리티 클래스 구현

```java
@Component
public class JwtUtil {

    private final String SECRET_KEY = "mySecretKey";
    private final int JWT_EXPIRATION = 86400000; // 24시간

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}
```

## JWT 요청 필터 구현

```java
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                   HttpServletResponse response,
                                   FilterChain chain) throws ServletException, IOException {

        final String requestTokenHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwtToken);
            } catch (IllegalArgumentException e) {
                System.out.println("Unable to get JWT Token");
            } catch (ExpiredJwtException e) {
                System.out.println("JWT Token has expired");
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwtToken, userDetails)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        chain.doFilter(request, response);
    }
}
```

## Security 구성

```java
@EnableWebSecurity
@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint)
            .and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

## 인증 컨트롤러

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Invalid credentials"));
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new JwtResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        // 사용자 등록 로직
        // 비밀번호 암호화, 데이터베이스 저장 등
        return ResponseEntity.ok(new MessageResponse("User registered successfully"));
    }
}
```

## 사용자 엔티티와 서비스

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String password;

    private String email;

    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>();

    // getters and setters
}

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User Not Found: " + username));

        return UserPrincipal.create(user);
    }
}
```

## 보안 고려사항

1. **시크릿 키 관리**: 환경변수나 외부 설정 파일에서 관리
2. **토큰 만료**: 적절한 만료 시간 설정
3. **리프레시 토큰**: 장기간 인증을 위한 리프레시 토큰 구현
4. **토큰 블랙리스트**: 로그아웃된 토큰 무효화
5. **HTTPS**: 토큰 전송 시 HTTPS 사용 필수

## 테스트

```java
@SpringBootTest
@AutoConfigureTestDatabase
class JwtAuthenticationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testLoginAndAccessProtectedResource() {
        // 로그인 테스트
        LoginRequest loginRequest = new LoginRequest("testuser", "password");
        ResponseEntity<JwtResponse> loginResponse = restTemplate.postForEntity(
            "/api/auth/login", loginRequest, JwtResponse.class);

        assertEquals(HttpStatus.OK, loginResponse.getStatusCode());
        assertNotNull(loginResponse.getBody().getToken());

        // 보호된 리소스 접근 테스트
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(loginResponse.getBody().getToken());
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
            "/api/protected", HttpMethod.GET, entity, String.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
```

## 마무리

JWT를 사용한 인증 시스템은 확장성과 성능 면에서 많은 장점을 제공합니다. 하지만 토큰 관리와 보안에 각별한 주의가 필요합니다.

다음 포스트에서는 OAuth2와 소셜 로그인 구현에 대해 알아보겠습니다.8:["slug","spring-boot-security-jwt","d"]
0:["lfdazvTdhEswHs6voOjbX",[[["",{"children":["blog",{"children":[["slug","spring-boot-security-jwt","d"],{"children":["__PAGE__?{\"slug\":\"spring-boot-security-jwt\"}",{}]}]}]},"$undefined","$undefined",true],["",{"children":["blog",{"children":[["slug","spring-boot-security-jwt","d"],{"children":["__PAGE__",{},[["$L1",["$","div",null,{"className":"bg-gray-50 min-h-screen","children":[["$","$L2",null,{}],["$","main",null,{"className":"pt-20","children":[["$","section",null,{"className":"bg-white","children":["$","div",null,{"className":"max-w-4xl mx-auto px-4 py-12","children":["$","div",null,{"children":[["$","a",null,{"href":"/blog","className":"inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":20,"height":20,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-arrow-left","children":[["$","path","1l729n",{"d":"m12 19-7-7 7-7"}],["$","path","x3x0zl",{"d":"M19 12H5"}],"$undefined"]}],"블로그로 돌아가기"]}],["$","div",null,{"className":"mb-6","children":["$","span",null,{"className":"px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium","children":"Backend"}]}],["$","h1",null,{"className":"text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight","children":"Spring Boot에서 JWT 인증 구현하기"}],["$","div",null,{"className":"flex flex-wrap items-center gap-6 text-gray-600 mb-8","children":[["$","div",null,{"className":"flex items-center gap-2","children":[["$","img",null,{"src":"https://via.placeholder.com/40x40","alt":"김태회","className":"w-10 h-10 rounded-full"}],["$","span",null,{"className":"font-medium","children":"김태회"}]]}],["$","div",null,{"className":"flex items-center gap-1","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":16,"height":16,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-calendar","children":[["$","rect","eu3xkr",{"width":"18","height":"18","x":"3","y":"4","rx":"2","ry":"2"}],["$","line","m3sa8f",{"x1":"16","x2":"16","y1":"2","y2":"6"}],["$","line","18kwsl",{"x1":"8","x2":"8","y1":"2","y2":"6"}],["$","line","xt86sb",{"x1":"3","x2":"21","y1":"10","y2":"10"}],"$undefined"]}],"2024년 1월 5일"]}],["$","div",null,{"className":"flex items-center gap-1","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":16,"height":16,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-clock","children":[["$","circle","1mglay",{"cx":"12","cy":"12","r":"10"}],["$","polyline","68esgv",{"points":"12 6 12 12 16 14"}],"$undefined"]}],"6 min read"]}]]}],null]}]}]}],["$","section",null,{"className":"bg-white","children":["$","div",null,{"className":"max-w-4xl mx-auto px-4 pb-12","children":[["$","div",null,{"className":"prose prose-lg max-w-none   prose-headings:text-gray-900   prose-p:text-gray-700 prose-p:leading-relaxed   prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline   prose-strong:text-gray-900   prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded   prose-pre:bg-gray-900 prose-pre:text-gray-100","dangerouslySetInnerHTML":{"__html":"$3"}}],["$","div",null,{"className":"flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200","children":[["$","span","Spring Boot",{"className":"inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":14,"height":14,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-tag","children":[["$","path","14b2ls",{"d":"M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"}],["$","path","7u93v4",{"d":"M7 7h.01"}],"$undefined"]}],"Spring Boot"]}],["$","span","JWT",{"className":"inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":14,"height":14,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-tag","children":[["$","path","14b2ls",{"d":"M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"}],["$","path","7u93v4",{"d":"M7 7h.01"}],"$undefined"]}],"JWT"]}],["$","span","Security",{"className":"inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":14,"height":14,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-tag","children":[["$","path","14b2ls",{"d":"M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"}],["$","path","7u93v4",{"d":"M7 7h.01"}],"$undefined"]}],"Security"]}]]}],["$","$L4",null,{"post":{"slug":"spring-boot-security-jwt","title":"Spring Boot에서 JWT 인증 구현하기","excerpt":"Spring Security와 JWT를 사용한 안전한 인증 시스템 구축 방법을 알아봅시다.","content":"$5","date":"2024-01-05","author":"김태회","category":"Backend","tags":["Spring Boot","JWT","Security"],"readingTime":"6 min read","image":null}}]]}]}],["$","section",null,{"id":"comments","className":"bg-gray-50","children":["$","div",null,{"className":"max-w-4xl mx-auto px-4 py-12","children":["$","$L6",null,{"postSlug":"spring-boot-security-jwt"}]}]}]]}]]}],null],null],null]},[null,["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children","blog","children","$8","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L9",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined"}]],null]},[null,["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children","blog","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L9",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined"}]],null]},[[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/d94babb66ce58f09.css","precedence":"next","crossOrigin":"$undefined"}]],["$","html",null,{"lang":"en","className":"scroll-smooth","children":["$","body",null,{"className":"font-sans antialiased bg-white text-gray-900","children":["$","$La",null,{"children":["$","div",null,{"className":"min-h-screen","children":["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L9",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":"404"}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],"notFoundStyles":[]}]}]}]}]}]],null],null],["$Lb",null]]]]
b:[["$","meta","0",{"name":"viewport","content":"width=device-width, initial-scale=1"}],["$","meta","1",{"charSet":"utf-8"}],["$","title","2",{"children":"Taehoe Kim - Backend Developer Portfolio"}],["$","meta","3",{"name":"description","content":"Portfolio of Taehoe Kim, a developer who loves building scalable and reliable backend systems."}],["$","meta","4",{"name":"author","content":"Taehoe Kim"}],["$","meta","5",{"name":"keywords","content":"backend,developer,portfolio,Java,Spring Boot,Python,Node.js,AWS"}],["$","meta","6",{"property":"og:title","content":"Taehoe Kim - Backend Developer Portfolio"}],["$","meta","7",{"property":"og:description","content":"A developer who loves building scalable and reliable backend systems"}],["$","meta","8",{"property":"og:locale","content":"en_US"}],["$","meta","9",{"property":"og:type","content":"website"}],["$","meta","10",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","11",{"name":"twitter:title","content":"Taehoe Kim - Backend Developer Portfolio"}],["$","meta","12",{"name":"twitter:description","content":"A developer who loves building scalable and reliable backend systems"}]]
1:null
